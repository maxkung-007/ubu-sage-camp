import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

test('แก้ไข title และคงค่า body เดิมได้', async () => {
  const srv = await startTestServer();

  try {
    const before = await srv.request('GET', '/api/announcements/1');
    const res = await srv.request('PATCH', '/api/announcements/1', { title: 'หัวข้อใหม่' });

    assert.equal(res.status, 200);
    assert.equal(res.data.title, 'หัวข้อใหม่');
    assert.equal(res.data.body, before.data.body);
  } finally {
    await srv.close();
  }
});

test('แก้ไขไม่บันทึกฟิลด์อื่นที่ส่งมา', async () => {
  const srv = await startTestServer();

  try {
    const res = await srv.request('PATCH', '/api/announcements/1', {
      title: 'หัวข้อใหม่',
      pinned: true,
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.title, 'หัวข้อใหม่');
    assert.equal('pinned' in res.data, false);
  } finally {
    await srv.close();
  }
});

test('แก้ไขด้วย title ว่างตอบ 400', async () => {
  const srv = await startTestServer();

  try {
    const res = await srv.request('PATCH', '/api/announcements/1', { title: '   ' });

    assert.equal(res.status, 400);
    assert.equal(typeof res.data.error, 'string');
  } finally {
    await srv.close();
  }
});

test('แก้ไขประกาศที่ไม่พบตอบ 404', async () => {
  const srv = await startTestServer();

  try {
    const res = await srv.request('PATCH', '/api/announcements/9999', { title: 'หัวข้อใหม่' });

    assert.equal(res.status, 404);
    assert.equal(typeof res.data.error, 'string');
  } finally {
    await srv.close();
  }
});