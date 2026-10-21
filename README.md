# NovaTech canlı sorğu

«İş yerində rəqəmsal transformasiyanın tətbiqi» təqdimatı üçün canlı sorğu və KPI paneli. Auditoriya QR kodu skan edib telefondan cavab verir, nəticələr proyektorda real vaxtda göstərilir.

| Səhifə | Kim üçün | Nə edir |
| --- | --- | --- |
| `/` | Auditoriya | 6 sual, hər biri təqdimatın bir slaydına bağlıdır |
| `/neticeler` | Proyektor | 5 canlı KPI, hər sualın qrafiki, QR kod. Hər 3 saniyədən bir yenilənir |
| `/admin` | Təqdimatçı | Sınaq cavablarını sıfırlamaq (açarla qorunur) |
| `/teqdimat` | Proyektor | 13 slaydlıq təqdimat, canlı nəticələr slaydların içində |
| `/teqdimat/natiq` | Təqdimatçı (noutbuk) | Cari və növbəti slayd, qeydlər, taymer, canlı cavab sayı |

## Vercel-ə deploy (təxminən 10 dəqiqə)

1. **GitHub-a yükləyin.** Bu qovluqdan yeni repozitoriya yaradın (`node_modules` və `.next` yüklənmir, `.gitignore` bunu təmin edir).
2. **Vercel-də layihə yaradın.** vercel.com → Add New → Project → repozitoriyanı seçin. Framework avtomatik "Next.js" kimi tanınır. Layihə adını, məsələn, `novatech-canli` qoyun - ünvan `novatech-canli.vercel.app` olacaq (ad tutulubsa, Vercel əlavə şəkilçi verir).
3. **Redis qoşun.** Layihənin Storage bölməsində Marketplace-dən **Upstash → Redis** əlavə edin və layihəyə bağlayın. Lazım olan mühit dəyişənləri (`UPSTASH_REDIS_REST_URL` / `KV_REST_API_URL` və tokeni) avtomatik əlavə olunur. Pulsuz plan bu sorğu üçün kifayətdir.
4. **Admin açarı əlavə edin.** Settings → Environment Variables → `ADMIN_KEY` = ən azı 12 simvolluq gizli söz.
5. **Redeploy edin** ki, yeni dəyişənlər tətbiq olunsun (Deployments → son deploy → Redeploy).
6. **Yoxlayın.** `/neticeler` açın: yuxarıda "Məlumat bazası qoşulmayıb" xəbərdarlığı **olmamalıdır**. Telefondan bir cavab verin, panel 3 saniyə ərzində yenilənməlidir. Sonra `/admin`-də nəticələri sıfırlayın.

Dəqiq ünvan məlum olandan sonra QR kodu təqdimata əlavə edin. `/neticeler` səhifəsindəki QR kod hər zaman cari domeni göstərir.

## Təqdimat rejimi

PowerPoint lazım deyil: slaydlar saytın içindədir və 1920×1080 səhnə kimi istənilən ekrana miqyaslanır.

1. Proyektora qoşulmuş ekranda `/teqdimat` açın, **F** ilə tam ekrana keçin.
2. Noutbukda **P** basın (və ya `/teqdimat/natiq` açın): qeydlər, taymer və növbəti slayd orada görünür. İki pəncərə avtomatik sinxron işləyir.
3. Aşağıdakı paneldən **Sinxron söndürülüb** düyməsinə basıb `ADMIN_KEY`-i bir dəfə daxil edin. Açar serverdə 8 saatlıq httpOnly sessiya cookie-sinə çevrilir, brauzerdə saxlanılmır. Bundan sonra auditoriyanın telefonları sizin slaydınızı izləyir: sual slaydında (1, 2, 7, 11, 12) həmin sual telefonda avtomatik açılır, digər slaydlarda telefon gözləmə ekranı göstərir. Sinxronu söndürəndə və ya 4 saat sonra telefonlar sərbəst rejimə qayıdır.

| Düymə | Əməl |
| --- | --- |
| → ← Space PageDown PageUp | Növbəti / əvvəlki slayd (klikerlər də işləyir) |
| Home / End | İlk / son slayd |
| rəqəm + Enter | Həmin slayda keç (məs. `12` Enter) |
| R | Cari slaydın canlı nəticələri (Esc bağlayır) |
| B və ya . | Qara ekran |
| F | Tam ekran |
| P | Natiq görünüşünü aç |

Wi-Fi-ya etibar yoxdursa, paneldəki **PDF** düyməsi ilə (və ya Ctrl+P → "PDF kimi saxla") bütün slaydları ehtiyat PDF kimi saxlayın. Slaydların mətni `src/components/deck/slides/`, natiq qeydləri isə `src/content/speaker-notes.ts` faylındadır.

## Lokal işə salma

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # domen testləri
npm run typecheck
```

Redis dəyişənləri olmadan lokal rejim yaddaşda işləyir (məlumat server yenidən başlayanda silinir). `.env.example` faylını `.env.local` kimi köçürüb dəyərləri doldurmaq olar. Node.js 20.9 və ya daha yeni versiya tələb olunur.

## Arxitektura

```
src/
  domain/        Suallar kataloqu, cavab qaydaları, KPI hesablanması (təmiz funksiyalar, testlərlə)
  server/        Saxlama portu + Redis və yaddaş adapterləri, sessiya, sorğu limiti, admin yoxlaması
  app/api/       answer · results · live · admin/reset · admin/session - nazik HTTP qatı
  components/    audience · results · admin · deck (slaydlar, natiq görünüşü) · shared
  content/       Slayd reyestri və natiq qeydləri
  lib/           API müqaviləsi, client sorğuları, polling hook-u, formatlaşdırma
```

- **Tək həqiqət mənbəyi:** sualı əlavə etmək və ya dəyişmək üçün yalnız `src/domain/questions.ts` redaktə olunur. Validasiya və qrafiklər oradan oxuyur.
- **Saxlama portu:** API yalnız `AnswerStore` interfeysini tanıyır. Redis istehsalda, yaddaş lokal inkişafda istifadə olunur.
- **Anonim sessiya:** server httpOnly cookie ilə anonim ID verir. Eyni suala təkrar cavab köhnəsini əvəz edir, iki dəfə sayılmır. Şəxsi məlumat toplanmır, IP yalnız heşlənmiş formada sorğu limiti üçün istifadə olunur.
- **Sorğu limiti:** iştirakçı başına 30 cavab/dəqiqə, IP başına 600/dəqiqə (bütün sinif bir universitet IP-sindən qoşula bilər).
- **Canlı yeniləmə:** WebSocket əvəzinə 3 saniyəlik polling - serverless mühitə uyğundur, zəif Wi-Fi-da dayanıqlıdır və tab gizləndikdə dayanır.

## Ölçülən KPI-lar

| KPI | Hesablanma | Slayddakı analoqu |
| --- | --- | --- |
| İştirakçılar | Unikal anonim sessiyalar | - |
| Tamamlama dərəcəsi | Bütün 6 suala cavab verənlər / iştirakçılar | Vaxtında icra |
| Orta cavab müddəti | Sualın ekranda açılmasından göndərilməyə qədər (0,3 san - 15 dəq aralığından kənar dəyərlər atılır) | Həll müddəti |
| Rəqəmsal yetkinlik | 5 sahə üzrə bütün balların ortası (1-5) | Baza göstərici |
| CSAT | 4 və 5 bal verənlərin payı | İstifadəçi məmnuniyyəti |

## Məhdudiyyətlər

- Anonim sorğudur: brauzer məlumatlarını təmizləyən iştirakçı yenidən sayıla bilər. Sinif sorğusu üçün bu qəbul ediləndir.
- Nəticələr statistik cəhətdən təmsilçi deyil; məqsəd ölçmə prosesini canlı göstərməkdir.
