import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let srv;

before(async () => {
  srv = await startTestServer();
});

after(async () => {
  await srv.close();
});

const ids = (res) => res.data.map((item) => item.id);

test('ค้นเจอโดยไม่สนตัวพิมพ์ใหญ่-เล็ก (title)', async () => {
  const created = srv.store.create({ title: 'Docker Guide', body: 'ทดสอบ' });
  const res = await srv.request('GET', '/api/search?q=DOCKER');
  assert.equal(res.status, 200);
  assert.ok(ids(res).includes(created.id));
  srv.store.remove(created.id);
});

test('ค้นเจอจาก body', async () => {
  const res = await srv.request('GET', '/api/search?q=' + encodeURIComponent('เครือข่าย'));
  assert.equal(res.status, 200);
  assert.deepEqual(ids(res), [2]);
});

test('ไม่ใส่คำค้น → ได้ทุกรายการ', async () => {
  const res = await srv.request('GET', '/api/search');
  assert.equal(res.status, 200);
  assert.equal(res.data.length, srv.store.list().length);
});

test('คำค้นว่างหรือมีแต่ช่องว่าง → ได้ทุกรายการ', async () => {
  const res = await srv.request('GET', '/api/search?q=%20%20');
  assert.equal(res.status, 200);
  assert.equal(res.data.length, srv.store.list().length);
});

test('ตัดช่องว่างหัว-ท้ายคำค้น', async () => {
  const res = await srv.request('GET', '/api/search?q=' + encodeURIComponent('  เครือข่าย  '));
  assert.equal(res.status, 200);
  assert.deepEqual(ids(res), [2]);
});

test('ไม่พบ → array ว่าง', async () => {
  const res = await srv.request('GET', '/api/search?q=zzzz');
  assert.equal(res.status, 200);
  assert.deepEqual(res.data, []);
});

test('อักขระพิเศษไม่ทำให้ server พัง', async () => {
  for (const q of ['(', '[', '*', '\\', '.*', '+?']) {
    const res = await srv.request('GET', '/api/search?q=' + encodeURIComponent(q));
    assert.equal(res.status, 200, `q=${q}`);
    assert.ok(Array.isArray(res.data));
  }
});

test('q ซ้ำหลายตัว (array) ไม่ทำให้ server พัง', async () => {
  const res = await srv.request('GET', '/api/search?q=a&q=b');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.data));
});

test('การค้นหาไม่เปลี่ยนข้อมูล', async () => {
  const before = JSON.stringify(srv.store.list());
  await srv.request('GET', '/api/search?q=docker');
  assert.equal(JSON.stringify(srv.store.list()), before);
});
