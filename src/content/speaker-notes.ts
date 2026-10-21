/** Speaker notes, verbatim from the original deck (Reqemsal_transformasiya_NovaTech.pptx), one entry per slide. */
export const SPEAKER_NOTES: readonly string[] = [
  `Giriş (təxminən 1 dəqiqə).

Bu təqdimatda rəqəmsal transformasiyanın iş yerində necə planlaşdırıla və tətbiq oluna biləcəyini NovaTech Solutions adlı IT xidmətləri və sistem inteqrasiyası şirkəti nümunəsində nəzərdən keçirəcəyik.

NovaTech müştərilərinə IT konsaltinq və texniki dəstək, proqram təminatının tətbiqi və dəstəyi, API inkişafı, korporativ tətbiqlərin və məlumatların inteqrasiyası, həmçinin hesabat və rəqəmsal iş axını həlləri təqdim edir. Maraqlı paradoks budur: başqalarına inteqrasiya həlləri təklif edən şirkətin öz daxili prosesləri böyümə ilə birlikdə dağınıq vəziyyətə düşə bilər.

Sağdakı sxem hədəf vəziyyəti göstərir: mərkəzdə inteqrasiya platforması, ətrafında API-lər, bulud, avtomatlaşdırma, analitika, sənəd idarəetməsi və kibertəhlükəsizlik. Bunlar ayrı-ayrı layihələr deyil, bir-biri ilə əlaqəli imkanlardır.

Əsas sualımız: ayrı-ayrı işləyən prosesləri inteqrasiya olunmuş, təhlükəsiz və məlumatlara əsaslanan mühitə necə çevirmək olar?

QR kodu göstərin: "Telefonunuzla skan edin, ilk sual sizin təşkilatınızın rəqəmsal vəziyyəti haqqındadır." Təxminən bir dəqiqə vaxt verin. Ünvan: novatech-live.vercel.app. Nəticələr paneli: novatech-live.vercel.app/neticeler.

Təqdimat bir hekayə kimi qurulub: ilkin vəziyyət, strategiya, yeddi konkret təşəbbüs, yol xəritəsi, ölçmə və risklər, sonda isə müzakirə. İlkin vəziyyət ssenari fərziyyələrinə əsaslanır; göstərilən faydalar isə tətbiqdən sonra yoxlanılmalı olan gözləntilərdir.

Keçid: şirkətin bugünkü vəziyyətindən başlayaq.`,

  `İlkin vəziyyət (təxminən 1,5 dəqiqə).

Soldakı sxem tipik "cari vəziyyət" mənzərəsidir. CRM, layihə uçotu, helpdesk və maliyyə sistemi mövcuddur, lakin onlar bir-biri ilə birbaşa əlaqəli deyil. Məlumat Excel cədvəllərində toplanır, təsdiqlər e-poçtla aparılır, rəhbərlik hesabatı isə əl ilə hazırlanır. Qırıq xətlər əl ilə köçürmə və təkrar daxiletmə nöqtələridir - səhvlərin və gecikmələrin əsas mənbəyi məhz buradır.

Sağda altı problemi P1-P6 kodları ilə qeyd etmişik. Bu kodlar növbəti slaydda hər təşəbbüsü konkret problemlə əlaqələndirmək üçün istifadə olunacaq.

P1 - köhnə tətbiqlər: dəyişiklik etmək risklidir, çünki biznes məntiqi sənədləşdirilməyib və kodun daxilində "gizlənib".
P2 - əlaqəsiz sistemlər: eyni müştəri və ya layihə məlumatı bir neçə sistemdə fərqli formada saxlanılır.
P3 - əl əməliyyatları: işçilərin vaxtı dəyər yaratmayan təkrar işlərə gedir.
P4 - sənədlər: hansı versiyanın son versiya olduğunu və kimin təsdiqlədiyini müəyyən etmək çətindir.
P5 - hesabatlar: rəqəmlər gec gəlir və mənbələr arasında uyğunsuz olur.
P6 - infrastruktur: giriş hüquqları, ehtiyat nüsxələr və miqyaslanma sistemli idarə olunmur.

Biznes nəticələri: əlavə əmək sərfi, təkrarlanan məlumat, məhdud şəffaflıq, çətin texniki dəstək və gecikən qərarlar. Diqqət: bu slaydda heç bir real statistika göstərmirik - bunlar ssenari fərziyyələridir.

Auditoriyaya sual verin və 2-3 cavab dinləyin. Adətən cavablar P2 (inteqrasiya) və P5 (hesabat) ətrafında toplanır - bu, növbəti slaydda prioritetləşdirmə müzakirəsinə yaxşı keçiddir.`,

  `Strategiya və hədəf vəziyyət (təxminən 1,5 dəqiqə).

Ən vacib mesaj: rəqəmsal transformasiya yeni proqram almaq deyil. O, dörd istiqamətdə eyni vaxtda dəyişiklik tələb edir: texnologiya, iş prosesləri, məlumatların idarə edilməsi, insanlar və bacarıqlar. Yalnız texnologiyanı dəyişib prosesləri köhnə saxlasaq, köhnə problemləri yeni sistemə köçürmüş olarıq.

Cədvəl bütün təqdimatın xəritəsidir. Hər sətir sol tərəfdə ilkin problemi (P), ortada təşəbbüsü (T), sağda isə hədəf vəziyyəti göstərir:
- T1 modernizasiya köhnə tətbiqlərin (P1) dəstəklənməsini asanlaşdırır.
- T2 inteqrasiya və standart API-lər əlaqəsiz sistemləri (P2) birləşdirir.
- T3 avtomatlaşdırma təkrarlanan əl işlərini (P3) azaldır.
- T4 elektron sənəd idarəetməsi dağınıq sənədləri (P4) vahid mənbəyə gətirir.
- T5 KPI panelləri gecikən hesabatları (P5) əvəz edir.
- T6 bulud infrastrukturu infrastruktur və təhlükəsizlik problemlərinə (P6) cavab verir.
- T7 süni intellekt bilik axtarışı və təhlil yükünə (P3, P5) kömək edir, lakin insan nəzarəti ilə.

Qeyd edin ki, təşəbbüslər bir-birindən asılıdır: məsələn, KPI paneli (T5) etibarlı inteqrasiya (T2) olmadan dəqiq məlumat göstərə bilməz, SI isə (T7) yaxşı təşkil olunmuş sənədlər (T4) olmadan faydalı ola bilməz. Buna görə ardıcıllıq vacibdir.

Keçid: növbəti slaydlarda hər təşəbbüsü ayrıca nəzərdən keçiririk, T1 modernizasiyadan başlayaraq.`,

  `Köhnə sistemlərin modernizasiyası (təxminən 1,5 dəqiqə).

Sol tərəfdə "əvvəl" vəziyyəti: sıx bağlı monolit. Ekranlar, biznes qaydaları, birbaşa SQL sorğuları və hesabat kodu bir-birinə qarışıb və hamısı eyni paylaşılan bazaya müraciət edir. Nəticədə bir dəyişiklik bütün sistemə təsir edir və hər buraxılış tam yenidən test tələb edir.

"Sonra" vəziyyəti: aydın qatlara bölünmüş arxitektura - təqdimat qatı (Angular və ya React), REST API qatı, tətbiq xidmətləri, domen qatı (biznes qaydaları) və məlumat girişi qatı (məsələn, EF Core və ya Dapper). Biznes qaydaları mərkəzdə və texnologiyadan asılı olmadan saxlanılır - bu, həm testləri, həm də gələcək dəyişiklikləri asanlaşdırır.

Yanaşma addımları:
1. Qiymətləndirmə - hansı tətbiqlər var, kim istifadə edir, nəyə bağlıdır.
2. Texniki borcu və kritik biznes məntiqini müəyyənləşdirmək - hansı modul ən riskli və ən dəyərlidir.
3. Refaktorinq və ya mərhələli əvəzetmə. "Strangler Fig" yanaşmasında köhnə sistem birdən söndürülmür: yeni funksiyalar ayrıca modulda yaradılır, trafik tədricən yeni hissəyə yönləndirilir.
4. Baza və API uyğunluğu - keçid dövründə köhnə və yeni hissələr paralel işləməlidir.
5. Test, sınaq miqrasiyası və rollback planı - geri qayıtmaq imkanı olmayan dəyişiklik riskdir.
6. Biznes davamlılığı - mövcud qaydalar qorunmalıdır; bunun üçün mövcud davranışı qeyd edən testlər yazmaq faydalıdır.

Vacib məqam: mikroservislər həmişə düzgün seçim deyil. Kiçik və orta komanda üçün yaxşı qurulmuş modul monolit çox vaxt daha sadə, daha ucuz və daha etibarlıdır. Ayrıca xidmət yalnız real ehtiyac olduqda - məsələn, müstəqil miqyaslanma və ya ayrıca komanda mülkiyyəti tələb olunduqda - ayrılır.`,

  `Sistem inteqrasiyası və API arxitekturası (təxminən 1,5 dəqiqə).

Sxemi soldan sağa oxuyaq. Sorğular üç mənbədən gəlir: web portal, daxili biznes tətbiqləri və xarici xidmətlər. Onların hamısı vahid giriş nöqtəsindən - API Gateway-dən keçir. Gateway autentifikasiya, marşrutlaşdırma, sorğu limiti və loglama kimi ümumi funksiyaları bir yerdə yerinə yetirir; beləliklə hər xidmət bu məntiqi təkrar yazmır.

Arxa tərəfdə biznes xidmətləri var: sorğu, inteqrasiya və sənəd xidmətləri. Onlar əməliyyat bazası (məsələn, PostgreSQL) və sənəd anbarı ilə işləyir. Hesabat sistemi əməliyyat bazasına birbaşa ağır sorğular göndərmir - o, replika və ya ETL vasitəsilə ayrıca məlumat qatından oxuyur. Bu, gündəlik işin performansını qoruyur.

Sağ paneldəki nəzarətlər:
- Autentifikasiya: OAuth 2.0 / OpenID Connect və JWT tokenlər.
- Giriş icazələri: rol əsaslı model və minimum hüquq prinsipi.
- Validasiya: həm format (sxem), həm də biznes qaydaları yoxlanılır.
- Xəta idarəetməsi: standart xəta cavabları və müvəqqəti nasazlıqlarda təkrar cəhd.
- Loglama: korrelyasiya ID ilə bir sorğunu bütün sistemlər boyu izləmək olur.
- Monitorinq: gecikmə, xəta dərəcəsi və əlçatanlıq.

Praktik nümunə: işçi portalda noutbuk sorğusu yaradır. Gateway tokeni yoxlayır, sorğu xidməti məlumatları validasiya edir, sorğu bazaya yazılır və audit loguna düşür. Daha sonra səlahiyyətli hesabat sistemi yalnız icazə verilmiş sahələri oxuyur. Məlumat bir dəfə daxil edilir və bütün zəncir boyu etibarlı qalır.`,

  `İş axını avtomatlaşdırılması və elektron sənəd idarəetməsi (təxminən 1,5 dəqiqə).

Nümunə kimi proqram lisenziyası sorğusunun təsdiqini götürək.

"Əvvəl": sorğu e-poçtla gəlir, işçi onu əl ilə yönləndirir, status Excel cədvəlində izlənir, təsdiqləyicilərə ayrıca zəng və ya məktub göndərilir, hesabat hazırlamaq isə əlavə iş tələb edir. Hər addımda gecikmə və itki riski var.

"Sonra": sorğu iş axını sistemində qeydə alınır, təsdiq əvvəlcədən müəyyən qaydalarla yönləndirilir (məsələn, məbləğdən asılı olaraq bir və ya iki səviyyəli təsdiq), bildirişlər avtomatik göndərilir, status və audit tarixçəsi saxlanılır, səlahiyyətli istifadəçilər prosesi paneldə izləyir.

Ortadakı prinsip ən vacib məqamdır: əvvəlcə sadələşdir, sonra standartlaşdır, yalnız ondan sonra avtomatlaşdır. Lazımsız təsdiq addımlarını avtomatlaşdırsaq, pis prosesi sadəcə sürətləndirmiş olarıq.

Elektron sənəd idarəetməsinin əsas nəzarət mexanizmləri:
- Versiyalama - hər dəyişiklik ayrıca versiya kimi saxlanılır, son versiya aydındır.
- Giriş icazələri - rola və sənəd növünə görə.
- Saxlama müddəti - hər sənəd növü üçün nə qədər saxlanılacağı və nə vaxt arxivləşdiriləcəyi.
- Ehtiyat nüsxə - müntəzəm backup və bərpanın real testi.
- Audit izi - kim, nə vaxt, hansı əməliyyatı etdi.

Bu mexanizmlər həm səmərəlilik, həm də uyğunluq (compliance) baxımından vacibdir.`,

  `İdarəetmə panelləri, hesabatlar və KPI (təxminən 1,5 dəqiqə).

Əvvəlcə vacib qeyd: paneldəki bütün rəqəmlər nümunəvi ssenari məlumatlarıdır, faktiki nəticə deyil. Onların məqsədi panelin necə görünəcəyini və necə istifadə olunacağını göstərməkdir.

Panel bir neçə sistemdən gələn məlumatı birləşdirir: helpdesk-dən həll müddəti və insidentlər, layihə sistemindən vaxtında icra, monitorinqdən əlçatanlıq, iş axını sistemindən təsdiq müddəti və avtomatlaşdırma əhatəsi, sorğulardan istifadəçi məmnuniyyəti. Bu, T2 inteqrasiya olmadan mümkün deyil.

Göstərici kateqoriyaları: sorğunun həll müddəti, tapşırıqların vaxtında icrası, sistem əlçatanlığı, insidentlərin sayı və təkrarlanması, sənəd təsdiqi müddəti, avtomatlaşdırma əhatəsi və istifadəçi məmnuniyyəti.

Necə istifadə olunur:
1. Darboğazları aşkarlamaq - məsələn, təsdiq müddəti hansı mərhələdə uzanır.
2. Prioritet müəyyənləşdirmək - təkrarlanan insidentlər hansı sistemdə cəmlənib (nümunədə "Tətbiq" kateqoriyası).
3. İrəliləyişi izləmək - edilən dəyişikliklər göstəriciləri həqiqətən yaxşılaşdırırmı.

Qeyd: KPI-ların sayı az, tərifləri isə dəqiq olmalıdır. Hər göstəricinin sahibi, məlumat mənbəyi və hesablama qaydası olmalıdır; əks halda müxtəlif şöbələr eyni KPI-ı fərqli hesablayacaq.

Auditoriyaya sual verin. Adətən rəhbərlik nəticə göstəricilərini (məmnuniyyət, vaxtında icra), texniki komanda isə səbəb göstəricilərini (təkrarlanan insidentlər, əlçatanlıq) seçir - bu fərqi qeyd etmək faydalıdır.`,

  `Süni intellekt və məlumat analitikası (təxminən 1,5 dəqiqə).

Əvvəlcə üç səviyyəni ayıraq:
- Ənənəvi hesabat "nə baş verdi?" sualına cavab verir.
- Məlumat analitikası "niyə baş verdi?" sualını araşdırır: trendlər, səbəb təhlili.
- SI dəstəkli tapşırıqlar təklif və köməklik verir: təsnifat, axtarış, anomaliya siqnalı. Qərarı isə insan verir.

Praktik tətbiq sahələri: texniki sənəd axtarışı, tiketlərin avtomatik təsnifatı, kod yazmaya köməkçi, bilik bazası köməkçisi, anomaliya aşkarlanması və trend təhlili. Proqnoz yalnız məlumat keyfiyyəti və həcmi imkan verdikdə mənalıdır.

Nümunə: mühəndis müştəri serverində VPN sertifikatını necə yeniləyəcəyini soruşur. Köməkçi əvvəlcə istifadəçinin giriş hüquqlarını yoxlayır, yalnız icazəli sənədlər arasında axtarış edir, cavabı mənbəyə istinadla verir. Bu yanaşma "axtarışla gücləndirilmiş generasiya" (RAG) adlanır. Son addım mühəndisin özünün mənbəni yoxlamasıdır.

Risklər və nəzarət:
- Halüsinasiya - model inandırıcı, lakin yanlış cavab verə bilər; mənbə göstərilməsi və yoxlama vacibdir.
- Məxfi məlumat - müştəri məlumatları yalnız təsdiqlənmiş mühitdə işlənməlidir.
- Giriş nəzarəti - köməkçi istifadəçinin görə bilmədiyi sənədi göstərməməlidir.
- İnsan yoxlaması - kritik qərarlarda məcburidir.
- Qiymətləndirmə - əvvəlcədən hazırlanmış test sualları dəsti ilə cavab keyfiyyəti mütəmadi ölçülür.

Əsas mesaj: SI işçiləri əvəz etmir və dəqiq proqnoza zəmanət vermir; o, düzgün qurulduqda rutin işə sərf olunan vaxtı azaldan alətdir.`,

  `Bulud infrastrukturu və kibertəhlükəsizlik (təxminən 1,5 dəqiqə).

Sxemdə istifadəçi əvvəlcə kimlik yoxlanışından (IAM və MFA) keçir, sonra WAF və yük balanslayıcı vasitəsilə tətbiq xidmətlərinə çatır. Tətbiqlər Dev, Test və Prod mühitlərinə ayrılıb - bu, test və inkişaf işlərinin istehsal mühitinə təsir etməsinin qarşısını alır. Məlumatlar şifrələnmiş, idarə olunan bazada saxlanılır və ayrı zonaya ehtiyat nüsxəsi çıxarılır. Monitorinq bütün komponentləri əhatə edir.

Üç xidmət modeli:
- IaaS - virtual serverlər, şəbəkə, disk. Əməliyyat sistemini və tətbiqi şirkət özü idarə edir. Köhnə tətbiqi dəyişmədən köçürmək üçün uyğundur.
- PaaS - platformanı provayder idarə edir, komanda kod və konfiqurasiyaya fokuslanır. Yeni web tətbiqləri və idarə olunan bazalar üçün uyğundur.
- SaaS - hazır proqram xidmət kimi istifadə olunur: e-poçt, ofis alətləri, helpdesk.

Təhlükəsizlik nəzarətləri: mərkəzləşdirilmiş IAM, MFA, minimum hüquq, ötürmə və saxlama zamanı şifrələmə, backup və bərpanın real testləri, monitorinq və insident cavab planı. Bundan əlavə, idarəetmə məsələləri: xərc idarəetməsi (büdcə limitləri, resursların teqlənməsi), vendor asılılığı və məlumatın harada saxlanılması - xüsusilə şəxsi məlumatlarla bağlı qanunvericilik tələbləri baxımından.

Ən vacib mesaj: bulud özü-özlüyündə nə xərcləri azaldır, nə də təhlükəsizliyi təmin edir. Ortaq məsuliyyət modelinə görə provayder infrastrukturu qoruyur, lakin hesabların, icazələrin və məlumatların düzgün konfiqurasiyası şirkətin öz məsuliyyətidir. Nəzarətsiz bulud həm baha, həm də riskli ola bilər.`,

  `Tətbiq yol xəritəsi (təxminən 2 dəqiqə).

Yol xəritəsi beş mərhələdən ibarətdir və hər mərhələnin sonunda növbətiyə keçid meyarı var. Bu, layihənin "hər şeyi eyni anda" etməyə çalışmasının qarşısını alır.

1. Qiymətləndirmə və araşdırma - proseslərin və sistemlərin inventarı, istifadəçilərlə müsahibələr və ən vacibi: baza göstəricilərinin ölçülməsi. Baza olmadan sonradan yaxşılaşmanı sübut etmək mümkün deyil.
2. Prioritet və arxitektura - təşəbbüslər dəyər və riskə görə sıralanır, hədəf arxitektura və təhlükəsizlik tələbləri müəyyən edilir.
3. Pilot - məhdud əhatədə, məsələn, bir daxili sorğu axınında. Pilot dörd sualı yoxlayır: real biznes dəyəri varmı; texniki cəhətdən işləyirmi; təhlükəsizlik tələbləri qarşılanırmı; istifadəçilər onu qəbul edirmi.
4. Mərhələli genişləndirmə - uğurlu pilotdan sonra digər proseslərə yayılma, inteqrasiya və təlim.
5. Ölçmə və davamlı təkmilləşdirmə - transformasiya bir dəfəlik layihə deyil, davamlı dövrdür.

Rollar: idarəetmə sponsoru (qərar və resurs), layihə meneceri, biznes analitik (proses və tələblər), həll arxitektoru, developerlər, infrastruktur və təhlükəsizlik mütəxəssisi, son istifadəçilər. Son istifadəçilərin pilotda iştirakı müqaviməti azaldır.

Qeyd: burada konkret tarix və büdcə göstərmirik. Real layihədə bunlar yalnız birinci mərhələnin nəticələrinə əsasən, qiymətləndirmədən sonra müəyyən edilə bilər.`,

  `Gözlənilən faydalar, KPI hədəfləri və risklər (təxminən 1,5 dəqiqə).

Bu cədvəl hər təşəbbüsü ölçülə bilən göstəriciyə, gözlənilən istiqamətə və əsas riskə bağlayır. Diqqət edin: faiz və ya məbləğ göstərmirik, yalnız istiqamət göstəririk (artım və ya azalma). Səbəb sadədir: baza ölçülməmiş hədəf qoymaq etibarsızdır. Konkret rəqəmsal hədəflər birinci mərhələdə baza ölçüldükdən sonra qoyulmalı və təklif olunan hədəf kimi qeyd edilməlidir.

Bir neçə nümunə:
- Modernizasiya üçün dəyişikliyin hazırlanma müddəti (lead time) və texniki xidmətə sərf olunan əmək ölçülür.
- İnteqrasiya üçün məlumat uyğunluğu və inteqrasiya xətalarının dərəcəsi.
- SI üçün yalnız qənaət olunan vaxt deyil, həm də cavab keyfiyyəti və insan yoxlaması payı ölçülür - əks halda sürət keyfiyyət hesabına arta bilər.

Risklər və azaltma tədbirləri: miqrasiya defektlərinə qarşı reqressiya testləri və rollback planı; inteqrasiya nasazlıqlarına qarşı kontrakt testləri və monitorinq; təhlükəsizlik insidentlərinə qarşı MFA və insident planı; zəif məlumat keyfiyyətinə qarşı məlumat sahibləri və validasiya qaydaları; istifadəçi müqavimətinə qarşı erkən cəlb etmə və təlim; bacarıq çatışmazlığına qarşı təlim və mentorluq; büdcə artımına qarşı mərhələli maliyyələşdirmə; vendor asılılığına qarşı açıq standartlar və çıxış strategiyası.

Əsas fikir: transformasiyanın uğuru tətbiq olunan texnologiyaların sayı ilə deyil, biznes nəticələri və əməliyyat göstəricilərinin real yaxşılaşması ilə ölçülür.`,

  `Nəticə və müzakirə (təxminən 1,5 dəqiqə + müzakirə).

Yeddi addımda bütün yolu xülasə edək: cari vəziyyəti anlamaq, real problemləri prioritetləşdirmək, sistemləri modernləşdirmək və inteqrasiya etmək, prosesləri əvvəlcə sadələşdirib sonra avtomatlaşdırmaq, məlumat və SI-dən məsuliyyətlə istifadə etmək, infrastrukturu qorumaq və nəticələri ölçüb davamlı təkmilləşdirmək.

Əsas nəticəni oxuyun: rəqəmsal transformasiyanın məqsədi daha çox texnologiya tətbiq etmək deyil, texnologiya vasitəsilə iş proseslərini daha səmərəli, təhlükəsiz və ölçülə bilən etməkdir.

Müzakirə sualları:
1. Hansı təşəbbüs birinci tətbiq olunmalıdır və niyə? Yaxşı cavab adətən asılılıqları nəzərə alır: inteqrasiya olmadan panellər, sənəd idarəetməsi olmadan SI tam fayda vermir.
2. Hansı KPI transformasiyanın işlədiyini ən yaxşı göstərir? Texniki göstərici ilə biznes nəticəsi arasındakı fərqi müzakirə edin.
3. Ən böyük risk nədir? Çox vaxt texniki deyil, insan və təşkilati risklər (müqavimət, bacarıq çatışmazlığı) daha ciddi olur.

Canlı sorğu: auditoriyadan QR kod vasitəsilə telefondan (və ya əl qaldırmaqla) A, B və ya C variantına səs vermələrini xahiş edin. Variantın adına klikləsəniz, müvafiq slayda (5, 6 və ya 7) keçid olunur və seçimi orada daha ətraflı müzakirə etmək mümkündür. Geri qayıtmaq üçün klaviaturada 12 yazıb Enter düyməsini basın. Sonra növbəti slayda keçib canlı nəticələri göstərin.`,

  `Canlı nəticələr (müzakirə ilə birlikdə təxminən 2 dəqiqə).

Real nəticələri və KPI-ları göstərin: iştirakçı sayı, tamamlama dərəcəsi, orta cavab müddəti, rəqəmsal yetkinlik indeksi və məmnuniyyət. Qeyd edin ki, bu, slayd 7-dəki panelin kiçik, canlı nümunəsidir: məlumat bir dəfə daxil edilir, avtomatik toplanır və dərhal qərar üçün görünür.

R düyməsi ilə hər sualın ətraflı nəticəsini açmaq olar.

Təşəkkür edin və suallara keçin.`,
];
