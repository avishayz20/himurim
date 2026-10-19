# הימורים ביציע — מדריך התקנה והפעלה

אפליקציית הימורים בין חברים על משחקי כדורגל. נבנתה עם React 18, Vite 5, TypeScript, Tailwind CSS ו-Supabase (מסד נתונים, התחברות, פונקציות שרת ועדכונים בזמן אמת).

## דרישות מוקדמות

- Node.js 18 ומעלה (מומלץ להתקין עם [nvm](https://github.com/nvm-sh/nvm))
- npm / bun / pnpm
- פרויקט Supabase פעיל (חינמי) — [supabase.com](https://supabase.com)

## התקנה

```sh
# 1. חילוץ הקובץ וכניסה לתיקייה
unzip hayamurim-baytia-source.zip
cd hayamurim-baytia-source

# 2. התקנת תלויות
npm install

# 3. הגדרת משתני סביבה (ראו למטה)
cp .env.example .env

# 4. הרצת שרת פיתוח
npm run dev
```

האתר יעלה בכתובת `http://localhost:8080`.

## משתני סביבה

צרו קובץ `.env` בשורש הפרויקט (אל תעלו אותו ל-Git). דוגמה ללא סודות אמיתיים:

```env
# מזהה הפרויקט ב-Supabase (נמצא ב-Project Settings → General)
VITE_SUPABASE_PROJECT_ID="your-project-ref"

# מפתח anon/public — בטוח לחשיפה בצד לקוח (Project Settings → API)
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key"

# כתובת ה-API של הפרויקט
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
```

> שימו לב: מפתח ה-`service_role` והסיסמה של מסד הנתונים **לא** נכנסים לקובץ הזה ולא לקוד הצד-לקוח בשום מצב. הם משמשים רק בצד השרת (Edge Functions) ומוגדרים שם כ-secrets.

## הגדרת מסד הנתונים

1. צרו פרויקט חדש ב-Supabase.
2. הריצו את המיגרציות שבתיקיית `supabase/migrations/` לפי הסדר (דרך ה-SQL Editor בדשבורד או עם Supabase CLI: `supabase db push`).
3. הפעילו התחברות באימייל ב-Authentication → Providers.
4. פרסו את פונקציות השרת שבתיקיית `supabase/functions/`:
   - `fetch-matches` — ייבוא משחקים מ-API חיצוני
   - `update-results` — עדכון תוצאות ולייב אוטומטי
   - `send-match-reminders` — התראות דחיפה למי שלא הימר

   ```sh
   supabase functions deploy fetch-matches
   supabase functions deploy update-results
   supabase functions deploy send-match-reminders
   ```

5. לפונקציות שדורשות מפתח API חיצוני (למשל football-data.org), הגדירו secret:
   ```sh
   supabase secrets set FOOTBALL_API_KEY="your-api-key"
   ```

## build לייצור

```sh
npm run build
```

התוצר נמצא בתיקיית `dist/` וניתן להעלאה לכל אירוח סטטי (Lovable, Vercel, Netlify וכו'). האפליקציה היא PWA — כולל Service Worker, מניפסט והתראות דחיפה, ולכן מומלץ להגיש אותה ב-HTTPS.

## מבנה הפרויקט בקצרה

- `src/pages/` — דפים ראשיים (בית, התחברות, איפוס סיסמה)
- `src/components/` — רכיבי ממשק (כרטיס משחק, טבלת דירוג, ניהול עונות וכו')
- `src/hooks/` — לוגיקת התחברות, הרשאות ותזכורות
- `supabase/functions/` — פונקציות שרת (Edge Functions)
- `supabase/migrations/` — סכמת מסד הנתונים

## הרשאות מנהל

משתמש המנהל מוגדר דרך טבלת `user_roles` במסד הנתונים (תפקיד `admin`). אל תשמרו תפקידים בטבלת הפרופילים.
