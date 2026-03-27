-- ============================================================
-- Seed: all 8 farms from src/data/farms.json
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to run multiple times (ON CONFLICT DO NOTHING)
-- ============================================================

INSERT INTO public.farms
  (slug, name, description, categories, lat, lng, address, city, kraj, zip,
   contact, opening_hours, images, verified, created_at)
VALUES
  (
    'statky-novak-jizni-cechy',
    'Statek Novák',
    'Rodinný statek ve třetí generaci zaměřený na ekologické pěstování zeleniny a ovoce. Prodáváme přímo ze dvora — bez prostředníků, vždy čerstvé. Nabízíme sezónní bedýnky s výběrem toho nejlepšího z naší zahrady.',
    ARRAY['zelenina','ovoce','vejce'],
    49.0747, 14.4181,
    'Třeboňská 42', 'Veselí nad Lužnicí', 'Jihočeský', '391 81',
    '{"phone":"+420 605 123 456","email":"info@stateknovak.cz","web":"https://stateknovak.cz","instagram":"stateknovak"}'::jsonb,
    '{"út":{"open":"08:00","close":"12:00"},"čt":{"open":"08:00","close":"17:00"},"so":{"open":"07:00","close":"11:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    TRUE, '2024-03-15T10:00:00Z'
  ),
  (
    'farma-pod-lipami-morava',
    'Farma Pod Lipami',
    'Paseme krávy na přirozených pastvinách Vysočiny. Naše mléko a sýry jsou vyráběny tradičními metodami bez přidaných konzervantů. Vítáme skupinové návštěvy a školní exkurze — rezervujte předem.',
    ARRAY['mléko','sýry','maso'],
    49.5955, 15.7895,
    'Náměstí 7', 'Polná', 'Vysočina', '588 13',
    '{"phone":"+420 731 987 654","email":"farma@podlipami.cz","instagram":"farma_pod_lipami","facebook":"FarmaPodLipami"}'::jsonb,
    '{"po":{"open":"09:00","close":"16:00"},"út":{"open":"09:00","close":"16:00"},"st":{"open":"09:00","close":"16:00"},"čt":{"open":"09:00","close":"16:00"},"pá":{"open":"09:00","close":"14:00"},"so":{"open":"09:00","close":"12:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    TRUE, '2024-05-20T08:30:00Z'
  ),
  (
    'vcely-a-med-beskydy',
    'Včely & Med Beskydy',
    'Rodinné včelařství v srdci Beskyd s více než 80 úly. Nabízíme květový, lesní, lipový a pohankový med. Vše sklízeno ručně a plněno do sklenic přímo u nás. Možnost prohlídky včelnice se včelařem.',
    ARRAY['med','byliny'],
    49.5353, 18.2116,
    'Horní Bečva 214', 'Horní Bečva', 'Zlínský', '756 57',
    '{"phone":"+420 777 246 810","email":"med@beskydy-vcelstvi.cz","web":"https://beskydy-vcelstvi.cz","instagram":"vcelybeskydy"}'::jsonb,
    '{"pá":{"open":"15:00","close":"18:00"},"so":{"open":"09:00","close":"13:00"},"ne":{"open":"10:00","close":"12:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    FALSE, '2024-07-01T14:00:00Z'
  ),
  (
    'pekarstvi-u-svajcarku',
    'Pekařství U Švajcarků',
    'Rodinné pekařství ve čtvrté generaci. Pečeme kváskový chléb, žitné bochníky a tradiční moravské koláče z mouky od místního mlynáře. Bez konzervantů, bez zlepšovadel — jen mouka, voda, sůl a čas.',
    ARRAY['chléb'],
    49.1951, 16.6068,
    'Masarykova 23', 'Brno-Žabovřesky', 'Jihomoravský', '616 00',
    '{"phone":"+420 543 234 567","email":"info@pekarstvibmo.cz","instagram":"pekarstvi_svajcarku","facebook":"PekarsviSvajcarku"}'::jsonb,
    '{"po":{"open":"06:00","close":"12:00"},"út":{"open":"06:00","close":"12:00"},"st":{"open":"06:00","close":"12:00"},"čt":{"open":"06:00","close":"12:00"},"pá":{"open":"06:00","close":"12:00"},"so":{"open":"07:00","close":"10:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    FALSE, '2024-09-10T07:00:00Z'
  ),
  (
    'mlokarna-zlata-louka',
    'Mlékárna Zlatá Louka',
    'Zpracováváme mléko od vlastního stáda 40 krav pasoucích se na pastvinách Vysočiny. Vyrábíme čerstvý sýr, eidamský blok, tvaroh a jogurty. Prodej přímo z mlékárny nebo rozvoz bedýnek každé úterý a pátek.',
    ARRAY['mléko','sýry'],
    49.7320, 15.5953,
    'Zlatá Louka 8', 'Chotěboř', 'Vysočina', '583 01',
    '{"phone":"+420 569 456 789","email":"mlekarna@zlata-louka.cz","web":"https://mlekarna-zlata-louka.cz","instagram":"mlekarna_zlata_louka"}'::jsonb,
    '{"út":{"open":"08:00","close":"17:00"},"čt":{"open":"08:00","close":"17:00"},"pá":{"open":"08:00","close":"16:00"},"so":{"open":"08:00","close":"11:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    TRUE, '2024-08-05T09:00:00Z'
  ),
  (
    'vinny-sklep-moravsky-podzim',
    'Vinný sklep Moravský podzim',
    'Rodinné vinařství na jižní Moravě s tradicí přes 100 let. Pěstujeme Welschriesling, Müller Thurgau, Frankovku a Zweigeltrebe. Vína lahvujeme ručně v tradičním sklepě ve Velkých Bílovicích. Ochutnávky po předchozí domluvě.',
    ARRAY['víno'],
    48.8543, 17.0235,
    'Sklepní ulice 14', 'Velké Bílovice', 'Jihomoravský', '691 02',
    '{"phone":"+420 608 789 012","email":"vino@moravsky-podzim.cz","web":"https://moravsky-podzim.cz","facebook":"VinnySklepMoravukyPodzim"}'::jsonb,
    '{"st":{"open":"14:00","close":"18:00"},"pá":{"open":"14:00","close":"18:00"},"so":{"open":"10:00","close":"17:00"},"ne":{"open":"11:00","close":"16:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    TRUE, '2024-06-12T11:00:00Z'
  ),
  (
    'ovci-farma-pod-orlickymi-horami',
    'Ovčí farma Pod Orlickými horami',
    'Chováme stádo 120 ovcí plemene šumavská ovce a merino. Nabízíme jehněčí maso, ovčí sýry a cottage, ovčí vlnu na zpracování. Farma je otevřena pro návštěvy, vítáme rodiny s dětmi — ovce jsou přátelské.',
    ARRAY['maso','sýry'],
    50.1867, 16.5042,
    'Pastvinská 7', 'Rokytnice v Orlických horách', 'Královéhradecký', '517 61',
    '{"phone":"+420 491 567 890","email":"farma@ovce-orlicke.cz","instagram":"ovce_orlicke_hory"}'::jsonb,
    '{"so":{"open":"09:00","close":"14:00"},"ne":{"open":"10:00","close":"13:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    FALSE, '2024-10-03T10:00:00Z'
  ),
  (
    'bylinkova-zahrada-sumava',
    'Bylinková zahrada Šumava',
    'Pěstujeme více než 60 druhů léčivých a aromatických bylin na okraji Šumavského národního parku. Suché byliny, čajové směsi, tinktury a lipový med z vlastního chovu včel. Prodej online i osobním odběrem.',
    ARRAY['byliny','med'],
    49.1783, 13.4623,
    'Modravská 3', 'Kvilda', 'Plzeňský', '385 92',
    '{"phone":"+420 380 123 456","email":"byliny@zahrada-sumava.cz","web":"https://zahrada-sumava.cz","instagram":"bylinkova_zahrada_sumava"}'::jsonb,
    '{"út":{"open":"09:00","close":"17:00"},"čt":{"open":"09:00","close":"17:00"},"so":{"open":"09:00","close":"14:00"}}'::jsonb,
    ARRAY['/images/placeholder-farm.jpg'],
    FALSE, '2024-11-20T08:00:00Z'
  )
ON CONFLICT (slug) DO NOTHING;
