# SoundFlow

SoundFlow е веб апликација направена во Vue 3, како проект по предметот Напреден веб дизајн.

Идејата на апликацијата е на едно место да се прикажат 10 најпознати електоронски музички издавачки куќи, заедно со дел од нивните артисти и изданија. Корисникот може да ги види сите 10 изџдавачки куќи, да отвори конкретно издание, да прочита краток опис и да пушти audio preview.

## Технологии

- Vue 3
- Vite
- Vue Router
- JavaScript
- CSS
- Node.js
- Express.js
- PostgreSQL

## Функционалности

- Приказ на 10 најпознати електоронски музички издавачки куќи
- Детална страна за секој издавачка куќа
- Приказ на музичките изданија
- Детална страна за секое издание
- Search и sort функционалност
- Audio player за слушање 
- Artwork за секој release
- “Also appears on” секција за артисти што се појавуваат на неколку releases

## Податоци

Податоците се чуваат во PostgreSQL database.

Во базата има табели за:

- labels
- artists
- releases
- release_artists
- release_versions

Самите audio, artwork и logo фајлови се наоѓаат во `public/` folder-от, а во PostgreSQL се чуваат нивните paths.


## Структура на проектот

```bash
src/
 ├── assets/
 ├── components/
 │    ├── LabelCard.vue
 │    ├── ReleaseCard.vue
 │    ├── SearchBox.vue
 │    └── SortSelect.vue
 │
 ├── router/
 │    └── index.js
 │
 ├── views/
 │    ├── AllReleasesView.vue
 │    ├── HomeView.vue
 │    ├── LabelView.vue
 │    └── ReleaseView.vue
 │
 ├── App.vue
 └── main.js
server/
 └── index.js
public/
 ├── artwork/
 ├── audio/
 └── logos/

```

## Како да се стартува проектот

За да се стартува проектот, прво треба да се клонира GitHub repository-то со командата `git clone https://github.com/BlagicaPavlova/NVD-proekt.git`. Потоа се влегува во project folder-от со `cd NVD-proekt` и се инсталираат dependencies со `npm install`.

Проектот користи PostgreSQL database, па потребно е PostgreSQL да биде инсталиран и стартуван. На macOS тоа може да се направи со `brew install postgresql` и `brew services start postgresql`. За проверка дали PostgreSQL е успешно инсталиран може да се користи командата `psql --version`.

Следно, треба да се креира database со име `soundflow` преку командата `createdb soundflow`, а потоа да се поврзе со базата преку `psql soundflow`.

Во PostgreSQL треба да се креираат табелите што ги користи проектот

Важно: Бидејќи проектот користи PostgreSQL database, потребно е прво да се креира базата `soundflow`, да се креираат табелите и да се внесат податоците. Ако базата или табелите не се креирани, backend API-то нема да може да ги врати податоците и апликацијата нема правилно да се прикаже.



Автор:
Благица Павлова
201146