import { useState } from 'react';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  Download,
  Home,
  LayoutGrid,
  Menu,
  Package,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
  Users,
  WalletCards,
} from 'lucide-react';

const bathroomImage =
  'https://images.pexels.com/photos/7546608/pexels-photo-7546608.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const roomImage =
  'https://images.pexels.com/photos/7166624/pexels-photo-7166624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const stages = [
  { number: '01', title: 'Подготовка поверхности', date: '12–13 мая', status: 'done' },
  { number: '02', title: 'Гидроизоляция', date: '14 мая', status: 'done' },
  { number: '03', title: 'Укладка плитки', date: '15–17 мая', status: 'active' },
  { number: '04', title: 'Монтаж сантехники', date: '18 мая', status: 'next' },
  { number: '05', title: 'Финальная уборка', date: '19 мая', status: 'next' },
];

const materials = [
  { title: 'Плитка керамогранитная', detail: 'Atlas Concorde · 14 м²', price: '35 840 ₽', color: 'sand' },
  { title: 'Смеситель для раковины', detail: 'Grohe Start · хром', price: '8 990 ₽', color: 'silver' },
  { title: 'Тумба под раковину', detail: 'Nero Wood · 80 см', price: '24 900 ₽', color: 'wood' },
];

const navItems = [
  { label: 'Главная', icon: Home },
  { label: 'Мои проекты', icon: LayoutGrid, selected: true },
  { label: 'Покупки', icon: ShoppingBag },
  { label: 'Материалы', icon: Package },
];

function App() {
  const [activeTab, setActiveTab] = useState('План работ');
  const [showAllStages, setShowAllStages] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">‹</span>ОМА</div>
        <nav className="main-nav">
          {navItems.map(({ label, icon: Icon, selected }) => (
            <button className={`nav-item ${selected ? 'selected' : ''}`} key={label}>
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Покупки' && <span className="nav-badge">2</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item"><CircleHelp size={17} /><span>Помощь</span></button>
          <button className="nav-item"><Settings2 size={17} /><span>Настройки</span></button>
          <div className="profile-mini">
            <div className="avatar avatar-small">АК</div>
            <div><strong>Анна Крылова</strong><span>Мой профиль</span></div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <button className="mobile-menu"><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Мои проекты</span><ChevronRight size={14} /><strong>Ремонт ванной комнаты</strong></div>
          <div className="top-actions">
            <button className="icon-button"><Search size={18} /></button>
            <button className="icon-button notification"><Bell size={18} /><i /></button>
            <div className="top-profile"><div className="avatar">АК</div><ChevronDown size={14} /></div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="hero-heading">
            <div>
              <div className="eyebrow"><span className="orange-dot" /> ПРОЕКТ В РАБОТЕ</div>
              <h1>Ремонт ванной комнаты</h1>
              <p>Квартира на Ленинском проспекте · 4,5 м²</p>
            </div>
            <div className="hero-actions">
              <button className={`outline-button ${isSaved ? 'saved' : ''}`} onClick={() => setIsSaved(!isSaved)}>
                {isSaved ? <Check size={16} /> : <Download size={16} />}{isSaved ? 'Сохранено' : 'Скачать план'}
              </button>
              <button className="primary-button"><Pencil size={16} /> Изменить проект</button>
            </div>
          </section>

          <section className="summary-grid">
            <div className="summary-card progress-card">
              <div className="summary-label"><ClipboardList size={17} /> Прогресс проекта</div>
              <div className="progress-row"><strong>60%</strong><span>3 из 5 этапов</span></div>
              <div className="progress-bar"><span style={{ width: '60%' }} /></div>
              <div className="progress-meta"><span>Начало <b>12 мая</b></span><span>Завершение <b>19 мая</b></span></div>
            </div>
            <div className="summary-card">
              <div className="summary-label"><WalletCards size={17} /> Ориентировочная стоимость</div>
              <strong className="summary-price">97 280 ₽</strong>
              <span className="summary-note">включая материалы и работу</span>
              <button className="text-link">Смотреть смету <ArrowRight size={14} /></button>
            </div>
            <div className="summary-card specialist-card">
              <div className="summary-label"><Users size={17} /> Ваш специалист</div>
              <div className="specialist-info"><div className="avatar avatar-specialist">АК</div><div><strong>Алексей К.</strong><span>Мастер-прораб</span></div><span className="online-dot" /></div>
              <button className="text-link">Написать специалисту <ArrowRight size={14} /></button>
            </div>
          </section>

          <div className="content-grid">
            <section className="main-column">
              <div className="section-heading">
                <div><h2>Готовый план вашего проекта</h2><p>Все этапы, материалы и услуги собраны в одном месте</p></div>
                <button className="more-button">•••</button>
              </div>
              <div className="tabs">
                {['План работ', 'Материалы', 'Услуги', 'Смета'].map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}
              </div>
              {activeTab === 'План работ' && <div className="plan-layout">
                <div className="stage-list">
                  {(showAllStages ? stages : stages.slice(0, 4)).map((stage) => <div className={`stage-item ${stage.status}`} key={stage.number}>
                    <div className="stage-marker">{stage.status === 'done' ? <Check size={13} /> : stage.number}</div>
                    <div className="stage-copy"><strong>{stage.title}</strong><span><CalendarDays size={13} />{stage.date}</span></div>
                    {stage.status === 'done' && <span className="stage-status">Готово</span>}
                    {stage.status === 'active' && <span className="stage-status active-status">Сейчас</span>}
                  </div>)}
                  <button className="show-more" onClick={() => setShowAllStages(!showAllStages)}>{showAllStages ? 'Свернуть' : 'Показать все этапы'} <ChevronDown size={14} className={showAllStages ? 'rotate' : ''} /></button>
                </div>
                <div className="project-preview">
                  <div className="preview-image"><img src={bathroomImage} alt="Визуализация ванной комнаты" /><span className="image-label"><Sparkles size={13} /> Визуализация</span></div>
                  <div className="preview-bottom"><div><span>Ожидаемая стоимость</span><strong>97 280 ₽</strong></div><div><span>Срок выполнения</span><strong>8 дней</strong></div></div>
                </div>
              </div>}
              {activeTab !== 'План работ' && <div className="tab-placeholder"><div className="placeholder-icon"><Package size={25} /></div><h3>{activeTab}</h3><p>Здесь собрана подробная информация по вашему проекту.</p><button className="primary-button">Открыть раздел <ArrowRight size={15} /></button></div>}
            </section>

            <aside className="right-column">
              <div className="image-card"><img src={roomImage} alt="Интерьер ванной комнаты" /><div className="image-card-overlay"><span>Ваш проект</span><strong>Ванная комната</strong><div><span>4,5 м²</span><span>•</span><span>Современный стиль</span></div></div></div>
              <div className="next-step-card"><div className="next-icon"><Clock3 size={17} /></div><div><span>Следующий шаг</span><strong>Выбрать материалы</strong><p>Подберите плитку и сантехнику для проекта</p></div><button aria-label="Перейти"><ArrowRight size={17} /></button></div>
              <div className="materials-card"><div className="section-heading compact"><h3>Материалы в проекте</h3><button className="text-link">Все <ArrowRight size={14} /></button></div>{materials.map((material) => <div className="material-row" key={material.title}><div className={`material-thumb ${material.color}`}><Package size={17} /></div><div><strong>{material.title}</strong><span>{material.detail}</span></div><b>{material.price}</b></div>)}</div>
            </aside>
          </div>
          <div className="tip-banner"><div className="tip-icon"><Sparkles size={18} /></div><div><strong>Сделайте проект ещё удобнее</strong><span>Добавьте замеры помещения, чтобы получить более точный расчёт материалов.</span></div><button className="outline-button">Добавить замеры <Plus size={15} /></button></div>
        </div>
      </main>
    </div>
  );
}

export default App;
