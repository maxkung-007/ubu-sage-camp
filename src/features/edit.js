// โมดูล A — แก้ไขประกาศ  ·  branch: feature/edit
// API ที่ต้องทำ: PATCH /api/announcements/:id
// รายละเอียด: การ์ดงาน (Issue) "A — แก้ไขประกาศ" บน Board ของทีม
//
// router = express.Router() ที่ mount ไว้ที่ /api แล้ว (เขียน path โดยไม่ต้องมี /api นำหน้า)
// store  = ตัวเก็บข้อมูล: list() · get(id) · create({title, body}) · update(id, patch) · remove(id)

import { validateAnnouncement } from '../validation.js';

export function register(router, { store }) {
  router.patch('/announcements/:id', (req, res) => {
    const id = Number(req.params.id);
    const item = store.get(id);
    if (!item) return res.status(404).json({ error: 'ไม่พบประกาศ' });

    const input = {
      title: req.body?.title === undefined ? item.title : req.body.title,
      body: req.body?.body === undefined ? item.body : req.body.body,
    };
    const { errors, value } = validateAnnouncement(input);
    if (errors.length) return res.status(400).json({ error: errors.join(', ') });

    res.json(store.update(id, value));
  });
}
