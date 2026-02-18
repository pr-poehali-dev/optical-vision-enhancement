import { useState, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"

const filmIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface FilmLocation {
  id: number
  name: string
  film: string
  year: number
  lat: number
  lng: number
  description: string
  image: string
}

const filmLocations: FilmLocation[] = [
  {
    id: 1,
    name: "Ласточкино гнездо",
    film: "Десять негритят",
    year: 1987,
    lat: 44.4305,
    lng: 34.1284,
    description: "Замок на скале — место действия детективного триллера по Агате Кристи. Здесь герои оказываются запертыми на острове.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Crimea_South_Coast_04-14_img10_Swallow_Nest.jpg/640px-Crimea_South_Coast_04-14_img10_Swallow_Nest.jpg",
  },
  {
    id: 2,
    name: "Бухта Ласпи",
    film: "Человек-амфибия",
    year: 1961,
    lat: 44.4167,
    lng: 33.7000,
    description: "Прозрачные воды бухты стали подводным миром Ихтиандра. Здесь снимали знаменитые сцены плавания.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Laspi_bay_1.jpg/640px-Laspi_bay_1.jpg",
  },
  {
    id: 3,
    name: "Воронцовский дворец",
    film: "Алые паруса",
    year: 1961,
    lat: 44.4198,
    lng: 34.0556,
    description: "Роскошный дворец в Алупке стал декорацией для экранизации повести Александра Грина о мечте и любви.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Vorontsov_Palace_in_Alupka.jpg/640px-Vorontsov_Palace_in_Alupka.jpg",
  },
  {
    id: 4,
    name: "Генуэзская крепость",
    film: "Пираты XX века",
    year: 1979,
    lat: 44.8414,
    lng: 34.9575,
    description: "Средневековая крепость Судака стала ареной сражений в самом кассовом фильме советского проката.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Sudak_fortress_2.jpg/640px-Sudak_fortress_2.jpg",
  },
  {
    id: 5,
    name: "Новый Свет",
    film: "3+2",
    year: 1963,
    lat: 44.8233,
    lng: 34.9167,
    description: "Живописные бухты посёлка — место съёмок культовой комедии о романтическом отпуске пятерых друзей.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Noviy_Svet_Crimea.jpg/640px-Noviy_Svet_Crimea.jpg",
  },
  {
    id: 6,
    name: "Белая скала (Ак-Кая)",
    film: "Всадник без головы",
    year: 1973,
    lat: 45.0997,
    lng: 34.6250,
    description: "Величественная скала изображала прерии Дикого Запада в приключенческом фильме по Майн Риду.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Aq-Qaya_2009.jpg/640px-Aq-Qaya_2009.jpg",
  },
  {
    id: 7,
    name: "Херсонес Таврический",
    film: "Сердца трёх",
    year: 1992,
    lat: 44.6114,
    lng: 33.4913,
    description: "Руины древнего города стали декорацией для экранизации приключенческого романа Джека Лондона.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Chersonesos_columns.jpg/640px-Chersonesos_columns.jpg",
  },
  {
    id: 8,
    name: "Массандровский дворец",
    film: "Сафо",
    year: 2008,
    lat: 44.5170,
    lng: 34.2030,
    description: "Изящный дворец Александра III — ключевая локация для съёмок мелодрамы с Ренатой Литвиновой.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Massandra_palace_2.jpg/640px-Massandra_palace_2.jpg",
  },
  {
    id: 9,
    name: "Долина Привидений (Демерджи)",
    film: "Кавказская пленница",
    year: 1966,
    lat: 44.7514,
    lng: 34.4075,
    description: "Легендарная сцена с «Орехом Никулина» снималась именно здесь. Камень до сих пор стоит у подножия горы.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Demerdzhi_1.jpg/640px-Demerdzhi_1.jpg",
  },
  {
    id: 10,
    name: "Ливадийский дворец",
    film: "Собака на сене",
    year: 1977,
    lat: 44.4678,
    lng: 34.1436,
    description: "Белоснежный дворец стал дворцом графини Дианы де Бельфлор в комедии по пьесе Лопе де Вега.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Livadiyskiy_dvorets.jpg/640px-Livadiyskiy_dvorets.jpg",
  },
  {
    id: 11,
    name: "Никитский ботанический сад",
    film: "Д'Артаньян и три мушкетёра",
    year: 1978,
    lat: 44.5113,
    lng: 34.2322,
    description: "Парижские сады кардинала Ришелье на самом деле — аллеи Никитского ботанического сада в Ялте.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Nikitsky_Botanical_Garden_3.jpg/640px-Nikitsky_Botanical_Garden_3.jpg",
  },
  {
    id: 12,
    name: "Набережная Ялты",
    film: "Асса",
    year: 1987,
    lat: 44.4932,
    lng: 34.1663,
    description: "Зимняя Ялта стала фоном для культового фильма Сергея Соловьёва с музыкой Гребенщикова и Цоя.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Yalta_seafront.jpg/640px-Yalta_seafront.jpg",
  },
  {
    id: 13,
    name: "Мыс Фиолент",
    film: "Дикари",
    year: 2006,
    lat: 44.5014,
    lng: 33.4889,
    description: "Скалистый мыс и лазурное море стали фоном для комедии о летнем отдыхе «дикарём» в Крыму.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Fiolent1.jpg/640px-Fiolent1.jpg",
  },
  {
    id: 14,
    name: "Карадагский заповедник",
    film: "Человек-амфибия",
    year: 1961,
    lat: 44.9333,
    lng: 35.2333,
    description: "Скала «Золотые ворота» — визитная карточка фильма. Здесь Ихтиандр выныривал из морской глубины.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Karadag_NR_-_Zoloti_vorota.jpg/640px-Karadag_NR_-_Zoloti_vorota.jpg",
  },
  {
    id: 15,
    name: "Ханский дворец, Бахчисарай",
    film: "Бахчисарайский фонтан",
    year: 1909,
    lat: 44.7488,
    lng: 33.8813,
    description: "Один из первых русских художественных фильмов. Фонтан слёз до сих пор привлекает поклонников Пушкина.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Hansaray_2.jpg/640px-Hansaray_2.jpg",
  },
]

const decades = [
  { label: "Все", value: "all" },
  { label: "1900–1960-е", value: "early" },
  { label: "1970-е", value: "70s" },
  { label: "1980-е", value: "80s" },
  { label: "1990-е+", value: "90s+" },
]

function getDecade(year: number): string {
  if (year < 1970) return "early"
  if (year < 1980) return "70s"
  if (year < 1990) return "80s"
  return "90s+"
}

interface FAQ {
  question: string
  answer: string
}

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeDecade, setActiveDecade] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({ name: "", film: "", location: "", comment: "" })
  const [formSent, setFormSent] = useState(false)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const filteredLocations = useMemo(() => {
    return filmLocations.filter((loc) => {
      const matchesDecade = activeDecade === "all" || getDecade(loc.year) === activeDecade
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q || loc.name.toLowerCase().includes(q) || loc.film.toLowerCase().includes(q)
      return matchesDecade && matchesSearch
    })
  }, [activeDecade, searchQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
    setFormData({ name: "", film: "", location: "", comment: "" })
    setTimeout(() => setFormSent(false), 4000)
  }

  const faqs: FAQ[] = [
    {
      question: "Можно ли посетить все локации за один день?",
      answer:
        "Локации разбросаны по всему Крыму, поэтому за один день успеть все не получится. Рекомендуем выделить 3–5 дней и группировать посещения по регионам: Южный берег, Судак и Новый Свет, Белогорский район.",
    },
    {
      question: "Как добраться до отмеченных мест?",
      answer:
        "Большинство локаций доступны на автомобиле. К некоторым, таким как Ласточкино гнездо или бухта Ласпи, легко добраться на общественном транспорте. Нажмите на маркер на карте — в описании есть подсказки по расположению.",
    },
    {
      question: "Нужно ли платить за вход?",
      answer:
        "Воронцовский, Ливадийский и Массандровский дворцы, Генуэзская крепость, Херсонес и Ханский дворец — музеи с платным входом. Природные локации (бухты, скалы, мысы) доступны бесплатно.",
    },
    {
      question: "Будут ли добавляться новые локации?",
      answer:
        "Да! Мы постоянно исследуем кинематографическую историю Крыма. Вы тоже можете предложить локацию через форму внизу страницы — мы проверим и добавим на карту.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(https://cdn.poehali.dev/projects/cce35268-5f5f-49ed-84b6-f10d4aa56aec/files/fe6e24af-d368-4b76-94e7-e43f7f67300e.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        </div>

        <nav className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <Icon name="Clapperboard" size={20} />
            <span className="font-medium text-balance">Крым в кадре</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {["Карта", "Локации", "Вопросы", "Предложить"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="bg-white text-black hover:bg-white/90 rounded-full px-6"
              onClick={() => document.getElementById("карта")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Icon name="Map" size={16} />
              <span className="ml-2">К карте</span>
            </Button>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
          <div className="mb-6 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <span className="text-sm font-medium">🎬 {filmLocations.length} кинолокаций на карте</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 text-balance">Крым в кадре</h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty">
            Интерактивная карта знаменитых мест Крыма, где снимались легендарные фильмы.
            Узнайте, где Ихтиандр плавал в море, а Шурик искал «Кавказскую пленницу».
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-4 text-lg"
              onClick={() => document.getElementById("карта")?.scrollIntoView({ behavior: "smooth" })}
            >
              Открыть карту
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8 py-4 text-lg"
              onClick={() => document.getElementById("локации")?.scrollIntoView({ behavior: "smooth" })}
            >
              Все локации
            </Button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <Icon name="Film" size={16} />
            <span className="text-sm font-medium">От «Кавказской пленницы» до «Пиратов XX века»</span>
          </div>
        </div>
      </div>

      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/30 ring-1 ring-white/20 mb-6">
                <Icon name="MapPin" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">{filmLocations.length} локаций</h3>
              <p className="text-white/80 leading-relaxed">Знаковые места съёмок по всему полуострову.</p>
            </div>
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/30 ring-1 ring-white/20 mb-6">
                <Icon name="Clapperboard" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Культовые фильмы</h3>
              <p className="text-white/80 leading-relaxed">Советская и современная классика кинематографа.</p>
            </div>
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/30 ring-1 ring-white/20 mb-6">
                <Icon name="Camera" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Фото локаций</h3>
              <p className="text-white/80 leading-relaxed">К каждому месту прикреплено фото — сравните с кадрами.</p>
            </div>
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/30 ring-1 ring-white/20 mb-6">
                <Icon name="Filter" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Фильтр по эпохам</h3>
              <p className="text-white/80 leading-relaxed">Ищите локации по десятилетиям и названиям фильмов.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="карта" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">Карта кинолокаций</h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto text-pretty">
                Нажмите на маркер, чтобы узнать, какой фильм снимали в этом месте
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                {decades.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setActiveDecade(d.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeDecade === d.value
                        ? "bg-white text-black"
                        : "bg-black/30 ring-1 ring-white/20 text-white/80 hover:bg-black/50"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Поиск по фильму или месту..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 ring-1 ring-white/20 rounded-full text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-white/40"
                />
              </div>
            </div>

            <div className="mb-4 text-sm text-white/50">
              Показано: {filteredLocations.length} из {filmLocations.length}
            </div>

            <div className="rounded-2xl overflow-hidden ring-1 ring-white/20" style={{ height: "520px" }}>
              <MapContainer
                center={[44.75, 34.2]}
                zoom={8}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {filteredLocations.map((loc) => (
                  <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={filmIcon}>
                    <Popup maxWidth={320} minWidth={280}>
                      <div style={{ color: "#1a1a2e", fontFamily: "Inter, sans-serif" }}>
                        <img
                          src={loc.image}
                          alt={loc.name}
                          style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }}
                        />
                        <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700 }}>{loc.name}</h3>
                        <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#6366f1", fontWeight: 600 }}>
                          🎬 «{loc.film}» ({loc.year})
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, color: "#555" }}>
                          {loc.description}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

      <section id="локации" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">Все локации</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto text-pretty">
              Каждое место хранит историю легендарных съёмок
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                className="group rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur overflow-hidden hover:ring-white/30 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-medium">
                    {loc.year}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-1">{loc.name}</h3>
                  <p className="text-sm text-indigo-400 font-medium mb-2">🎬 «{loc.film}»</p>
                  <p className="text-sm text-white/70 leading-relaxed">{loc.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-16">
              <Icon name="SearchX" size={48} className="mx-auto mb-4 text-white/30" />
              <p className="text-xl text-white/50">Ничего не найдено. Попробуйте изменить фильтр.</p>
            </div>
          )}
        </div>
      </section>

      <section id="вопросы" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Частые вопросы</h2>
              <p className="text-lg text-white/80">Всё, что нужно знать о кинолокациях Крыма</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-lg font-medium pr-4">{faq.question}</span>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black/30 ring-1 ring-white/20 flex items-center justify-center">
                      <Icon name={openFaq === index ? "Minus" : "Plus"} size={16} />
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="предложить" className="relative z-10 py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/30 ring-1 ring-white/20 mb-6">
                <Icon name="Send" size={28} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Предложить локацию</h2>
              <p className="text-lg text-white/80">
                Знаете место в Крыму, где снимали фильм? Расскажите нам — добавим на карту!
              </p>
            </div>

            {formSent ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 ring-1 ring-green-400/40 mb-6">
                  <Icon name="Check" size={32} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Спасибо!</h3>
                <p className="text-white/70">Мы проверим информацию и добавим локацию на карту.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Название места</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Например: Мраморная пещера"
                    className="w-full px-4 py-3 bg-black/30 ring-1 ring-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-white/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Название фильма</label>
                  <input
                    type="text"
                    required
                    value={formData.film}
                    onChange={(e) => setFormData({ ...formData, film: e.target.value })}
                    placeholder="Например: Обыкновенное чудо"
                    className="w-full px-4 py-3 bg-black/30 ring-1 ring-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-white/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Ваше имя</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Как вас зовут?"
                    className="w-full px-4 py-3 bg-black/30 ring-1 ring-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-white/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Комментарий (необязательно)</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Расскажите подробнее: какие сцены снимали, в каком году..."
                    rows={3}
                    className="w-full px-4 py-3 bg-black/30 ring-1 ring-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-white/40 resize-none"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full bg-white text-black hover:bg-white/90 rounded-xl py-4 text-lg">
                  Отправить предложение
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section id="о проекте" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/30 ring-1 ring-white/20 mb-8">
              <Icon name="Heart" size={28} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">О проекте</h2>
            <p className="text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
              «Крым в кадре» — путеводитель для тех, кто хочет увидеть Крым глазами кинематографистов.
              Мы собрали культовые локации, где снимались любимые фильмы, и нанесли их на интерактивную карту.
            </p>
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
              Исследуйте полуостров по-новому — следуя не путеводителям, а кадрам из фильмов.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon name="Clapperboard" size={20} />
              <span className="font-medium">Крым в кадре</span>
            </div>
            <p className="text-white/50 text-sm">© 2026 Крым в кадре. Интерактивная карта кинолокаций Крыма.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index