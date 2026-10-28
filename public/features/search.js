// โมดูล B — ค้นหาประกาศ  ·  branch: feature/search
// หน้าเว็บของฟีเจอร์ — ดูเครื่องมือที่ใช้ได้ใน ctx ที่หัวไฟล์ public/app.js

export function init(ctx) {
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'ค้นหาประกาศ...';
  input.setAttribute('aria-label', 'ค้นหาประกาศ');
  ctx.toolbar.append(input);

  let query = '';
  ctx.addFilter((item) => {
    if (!query) return true;
    return (
      String(item.title ?? '').toLowerCase().includes(query) ||
      String(item.body ?? '').toLowerCase().includes(query)
    );
  });

  input.addEventListener('input', () => {
    query = input.value.trim().toLowerCase();
    ctx.render();
  });
}
