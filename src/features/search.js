// โมดูล B — ค้นหาประกาศ  ·  branch: feature/search
// API ที่ต้องทำ: GET /api/search?q=
// รายละเอียด: การ์ดงาน (Issue) "B — ค้นหาประกาศ" บน Board ของทีม
//
// router = express.Router() ที่ mount ไว้ที่ /api แล้ว (เขียน path โดยไม่ต้องมี /api นำหน้า)
// store  = ตัวเก็บข้อมูล: list() · get(id) · create({title, body}) · update(id, patch) · remove(id)

export function register(router, { store }) {
  router.get('/search', (req, res) => {
    const raw = typeof req.query.q === 'string' ? req.query.q : '';
    const q = raw.trim().toLowerCase();
    const items = store.list();
    if (!q) return res.json(items);
    res.json(
      items.filter(
        (item) =>
          String(item.title ?? '').toLowerCase().includes(q) ||
          String(item.body ?? '').toLowerCase().includes(q),
      ),
    );
  });
}
