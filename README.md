# Platonus

Учебный макет студенческого портала Platonus (HTML/CSS/JS).

## Страницы

- `index.html` — главная (календарь, объявления, уведомления)
- `journal.html` — журнал текущей успеваемости

## Запуск локально

```bash
python3 -m http.server 8080
```

Откройте http://localhost:8080

## GitHub Pages

Сайт публикуется автоматически при push в `main` (workflow `.github/workflows/deploy-pages.yml`).

**Первый запуск:** в репозитории на GitHub откройте **Settings → Pages → Build and deployment → Source** и выберите **GitHub Actions**.

После успешного деплоя сайт будет доступен по адресу:

**https://zhanickk.github.io/platonus/**
