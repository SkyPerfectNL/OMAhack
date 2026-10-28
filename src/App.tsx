import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  Bell,
  Building2,
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
  PaintRoller,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
  Utensils,
  Users,
  WalletCards,
} from 'lucide-react';

type Screen = 'dashboard' | 'wizard' | 'result';
type WizardStep = 'task' | 'params' | 'style';
type TaskId = 'paint-room' | 'bathroom' | 'kitchen' | 'apartment' | 'house' | 'other';
type RoomKind = 'room' | 'bathroom' | 'other';
type WallCondition = 'good' | 'needs-prep' | 'severe';
type StyleId = 'scandinavian' | 'minimal' | 'modern' | 'loft' | 'classic' | 'custom';
type BudgetTier = 'economy' | 'comfort' | 'premium';

type ProjectDraft = {
  task: TaskId | null;
  taskNote: string;
  room: {
    lengthM: number;
    widthM: number;
    heightM: number;
    kind: RoomKind;
    wallCondition: WallCondition;
    needsSpecialist: boolean;
  };
  style: StyleId | null;
  customStyle: string;
  paletteId: string | null;
  budget: BudgetTier;
};

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
  { label: 'Мои проекты', icon: LayoutGrid },
  { label: 'Покупки', icon: ShoppingBag },
  { label: 'Материалы', icon: Package },
];

const TASK_OPTIONS = [
  { id: 'paint-room', label: 'Покрасить комнату', description: 'Подготовка и окраска стен', icon: PaintRoller },
  { id: 'bathroom', label: 'Сделать ремонт в ванной', description: 'Отделка и сантехника', icon: Bath },
  { id: 'kitchen', label: 'Обновить кухню', description: 'Отделка и обновление кухни', icon: Utensils },
  { id: 'apartment', label: 'Ремонт квартиры', description: 'Несколько помещений', icon: Building2 },
  { id: 'house', label: 'Строительство дома', description: 'Работы по дому и участку', icon: Home },
  { id: 'other', label: 'Другая задача', description: 'Опишите задачу своими словами', icon: Sparkles },
] as const;

const ROOM_KINDS: { value: RoomKind; label: string }[] = [
  { value: 'room', label: 'Комната' },
  { value: 'bathroom', label: 'Ванная' },
  { value: 'other', label: 'Другое' },
];

const WALL_OPTIONS: { value: WallCondition; label: string; hint: string }[] = [
  { value: 'good', label: 'Хорошее', hint: 'Ровные, без трещин и заметных дефектов' },
  { value: 'needs-prep', label: 'Требует подготовки', hint: 'Старая краска, обои или небольшие неровности' },
  { value: 'severe', label: 'Серьёзные дефекты', hint: 'Сырость, плесень или сильные неровности' },
];

const BUDGET_OPTIONS: { value: BudgetTier; label: string; detail: string }[] = [
  { value: 'economy', label: 'Эконом', detail: 'Практичные решения' },
  { value: 'comfort', label: 'Комфорт', detail: 'Баланс цены и качества' },
  { value: 'premium', label: 'Премиум', detail: 'Материалы высокого класса' },
];

const STYLE_OPTIONS = [
  { value: 'scandinavian', label: 'Скандинавский', description: 'Светлые тона и натуральные фактуры' },
  { value: 'minimal', label: 'Минимализм', description: 'Простые формы и минимум деталей' },
  { value: 'modern', label: 'Современный', description: 'Лаконичные сочетания и акценты' },
  { value: 'loft', label: 'Лофт', description: 'Фактурные поверхности и контрасты' },
  { value: 'classic', label: 'Классика', description: 'Спокойные оттенки и традиционные формы' },
  { value: 'custom', label: 'Свой вариант', description: 'Опишите свои пожелания' },
] as const;

const PALETTE = [
  { id: 'milk', name: 'Молочный', hex: '#f1e8d8' },
  { id: 'sand', name: 'Песочный', hex: '#dccfb9' },
  { id: 'stone', name: 'Светло-серый', hex: '#e2dfda' },
  { id: 'pearl', name: 'Жемчужный', hex: '#f4f2ee' },
  { id: 'sky', name: 'Небесный', hex: '#a9c0d6' },
  { id: 'teal', name: 'Морская волна', hex: '#7eafa8' },
  { id: 'olive', name: 'Оливковый', hex: '#8f9a55' },
  { id: 'rose', name: 'Пыльная роза', hex: '#e4a3a0' },
  { id: 'lilac', name: 'Лавандовый', hex: '#c2b3d8' },
  { id: 'blush', name: 'Пудровый', hex: '#efc9c6' },
] as const;

const DEFAULT_DRAFT: ProjectDraft = {
  task: 'bathroom',
  taskNote: '',
  room: {
    lengthM: 2.25,
    widthM: 2,
    heightM: 2.7,
    kind: 'bathroom',
    wallCondition: 'needs-prep',
    needsSpecialist: false,
  },
  style: 'modern',
  customStyle: '',
  paletteId: 'stone',
  budget: 'comfort',
};

const STEP_ORDER: WizardStep[] = ['task', 'params', 'style'];
const STEP_LABELS: Record<WizardStep, string> = {
  task: 'Задача',
  params: 'Параметры',
  style: 'Стиль и цвет',
};

function taskLabel(task: TaskId | null): string {
  return TASK_OPTIONS.find((item) => item.id === task)?.label ?? 'Новая задача';
}

function formatNumber(value: number): string {
  return value.toLocaleString('ru-RU', { maximumFractionDigits: 1 });
}

function roomKindLabel(value: RoomKind): string {
  return ROOM_KINDS.find((item) => item.value === value)?.label ?? 'Помещение';
}

function wallConditionLabel(value: WallCondition): string {
  return WALL_OPTIONS.find((item) => item.value === value)?.label ?? 'Не указано';
}

function budgetLabel(value: BudgetTier): string {
  return BUDGET_OPTIONS.find((item) => item.value === value)?.label ?? 'Не указан';
}

function styleLabel(value: StyleId | null, customStyle: string): string {
  if (value === 'custom') return customStyle.trim() || 'Свой вариант';
  return STYLE_OPTIONS.find((item) => item.value === value)?.label ?? 'Не выбран';
}

function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [wizardStep, setWizardStep] = useState<WizardStep>('task');
  const [draft, setDraft] = useState<ProjectDraft>(DEFAULT_DRAFT);
  const [activeTab, setActiveTab] = useState('План работ');
  const [showAllStages, setShowAllStages] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const updateDraft = (patch: Partial<ProjectDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };
  const updateRoom = (patch: Partial<ProjectDraft['room']>) => {
    setDraft((current) => ({ ...current, room: { ...current.room, ...patch } }));
  };
  const openWizard = (step: WizardStep = 'task') => {
    setWizardStep(step);
    setScreen('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goBack = () => {
    const index = STEP_ORDER.indexOf(wizardStep);
    if (index === 0) {
      setScreen('dashboard');
      return;
    }
    setWizardStep(STEP_ORDER[index - 1]);
  };

  const floorM2 = draft.room.lengthM * draft.room.widthM;
  const wallsM2 = 2 * (draft.room.lengthM + draft.room.widthM) * draft.room.heightM;
  const dimensionsValid =
    Number.isFinite(draft.room.lengthM) && draft.room.lengthM >= 1 && draft.room.lengthM <= 20 &&
    Number.isFinite(draft.room.widthM) && draft.room.widthM >= 1 && draft.room.widthM <= 20 &&
    Number.isFinite(draft.room.heightM) && draft.room.heightM >= 2 && draft.room.heightM <= 5;
  const canContinue = wizardStep === 'task'
    ? (draft.task !== null || draft.taskNote.trim().length > 0) && (draft.task !== 'other' || draft.taskNote.trim().length > 0)
    : wizardStep === 'params'
      ? dimensionsValid
      : draft.style !== null && (draft.style !== 'custom' || draft.customStyle.trim().length > 0);

  const goNext = () => {
    if (!canContinue) return;
    const index = STEP_ORDER.indexOf(wizardStep);
    if (index < STEP_ORDER.length - 1) {
      setWizardStep(STEP_ORDER[index + 1]);
    } else {
      setScreen('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNav = (label: string) => {
    if (label === 'Главная' || label === 'Мои проекты') {
      setScreen('dashboard');
      return;
    }
    setScreen('dashboard');
    setActiveTab(label === 'Покупки' || label === 'Материалы' ? 'Материалы' : 'Услуги');
  };

  const pageTitle = screen === 'wizard'
    ? 'Настройка проекта'
    : screen === 'result'
      ? 'Параметры проекта'
      : 'Ремонт ванной комнаты';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">‹</span>ОМА</div>
        <nav className="main-nav" aria-label="Основная навигация">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              className={`nav-item ${screen === 'dashboard' && label === 'Мои проекты' ? 'selected' : ''}`}
              key={label}
              onClick={() => handleNav(label)}
              type="button"
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Покупки' && <span className="nav-badge">2</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item" type="button"><CircleHelp size={17} /><span>Помощь</span></button>
          <button className="nav-item" type="button"><Settings2 size={17} /><span>Настройки</span></button>
          <div className="profile-mini">
            <div className="avatar avatar-small">АК</div>
            <div><strong>Анна Крылова</strong><span>Мой профиль</span></div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <button className="mobile-menu" type="button" aria-label="Меню"><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Мои проекты</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div>
          <div className="top-actions">
            <button className="icon-button" type="button" aria-label="Поиск"><Search size={18} /></button>
            <button className="icon-button notification" type="button" aria-label="Уведомления"><Bell size={18} /><i /></button>
            <div className="top-profile"><div className="avatar">АК</div><ChevronDown size={14} /></div>
          </div>
        </header>

        {screen === 'dashboard' && (
          <div className="page-wrap">
            <section className="hero-heading">
              <div>
                <div className="eyebrow"><span className="orange-dot" /> ПРОЕКТ В РАБОТЕ</div>
                <h1>Ремонт ванной комнаты</h1>
                <p>Квартира на Ленинском проспекте · 4,5 м²</p>
              </div>
              <div className="hero-actions">
                <button className={`outline-button ${isSaved ? 'saved' : ''}`} onClick={() => setIsSaved(!isSaved)} type="button">
                  {isSaved ? <Check size={16} /> : <Download size={16} />}{isSaved ? 'Сохранено' : 'Скачать план'}
                </button>
                <button className="primary-button" onClick={() => openWizard('task')} type="button"><Pencil size={16} /> Изменить проект</button>
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
                <span className="summary-note">демонстрационные данные</span>
                <button className="text-link" onClick={() => setActiveTab('Смета')} type="button">Смотреть смету <ArrowRight size={14} /></button>
              </div>
              <div className="summary-card specialist-card">
                <div className="summary-label"><Users size={17} /> Ваш специалист</div>
                <div className="specialist-info"><div className="avatar avatar-specialist">АК</div><div><strong>Алексей К.</strong><span>Демонстрационный профиль</span></div><span className="online-dot" /></div>
                <button className="text-link" onClick={() => setActiveTab('Услуги')} type="button">Услуги специалистов <ArrowRight size={14} /></button>
              </div>
            </section>

            <div className="content-grid">
              <section className="main-column">
                <div className="section-heading">
                  <div><h2>Готовый план вашего проекта</h2><p>Демонстрационный экран — реальные расчёты подключим следующим этапом</p></div>
                  <button className="more-button" type="button" aria-label="Дополнительные действия">•••</button>
                </div>
                <div className="tabs">
                  {['План работ', 'Материалы', 'Услуги', 'Смета'].map((tab) => <button type="button" key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}
                </div>
                {activeTab === 'План работ' && <div className="plan-layout">
                  <div className="stage-list">
                    {(showAllStages ? stages : stages.slice(0, 4)).map((stage) => <div className={`stage-item ${stage.status}`} key={stage.number}>
                      <div className="stage-marker">{stage.status === 'done' ? <Check size={13} /> : stage.number}</div>
                      <div className="stage-copy"><strong>{stage.title}</strong><span><CalendarDays size={13} />{stage.date}</span></div>
                      {stage.status === 'done' && <span className="stage-status">Готово</span>}
                      {stage.status === 'active' && <span className="stage-status active-status">Сейчас</span>}
                    </div>)}
                    <button className="show-more" onClick={() => setShowAllStages(!showAllStages)} type="button">{showAllStages ? 'Свернуть' : 'Показать все этапы'} <ChevronDown size={14} className={showAllStages ? 'rotate' : ''} /></button>
                  </div>
                  <div className="project-preview">
                    <div className="preview-image"><img src={bathroomImage} alt="Демонстрационная визуализация ванной комнаты" /><span className="image-label"><Sparkles size={13} /> Визуализация</span></div>
                    <div className="preview-bottom"><div><span>Пример стоимости</span><strong>97 280 ₽</strong></div><div><span>Пример срока</span><strong>8 дней</strong></div></div>
                  </div>
                </div>}
                {activeTab !== 'План работ' && <div className="tab-placeholder"><div className="placeholder-icon"><Package size={25} /></div><h3>{activeTab}</h3><p>Этот раздел подключим к каталогу и бизнес-логике следующим этапом.</p><button className="primary-button" onClick={() => openWizard(activeTab === 'Материалы' ? 'params' : 'task')} type="button">Уточнить проект <ArrowRight size={15} /></button></div>}
              </section>

              <aside className="right-column">
                <div className="image-card"><img src={roomImage} alt="Демонстрационный интерьер ванной комнаты" /><div className="image-card-overlay"><span>Ваш проект</span><strong>Ванная комната</strong><div><span>4,5 м²</span><span>•</span><span>Современный стиль</span></div></div></div>
                <div className="next-step-card"><div className="next-icon"><Clock3 size={17} /></div><div><span>Следующий шаг</span><strong>Уточнить параметры</strong><p>Добавьте размеры помещения для будущего расчёта</p></div><button onClick={() => openWizard('params')} aria-label="Добавить замеры" type="button"><ArrowRight size={17} /></button></div>
                <div className="materials-card"><div className="section-heading compact"><h3>Материалы в примере</h3><button className="text-link" onClick={() => setActiveTab('Материалы')} type="button">Все <ArrowRight size={14} /></button></div>{materials.map((material) => <div className="material-row" key={material.title}><div className={`material-thumb ${material.color}`}><Package size={17} /></div><div><strong>{material.title}</strong><span>{material.detail}</span></div><b>{material.price}</b></div>)}</div>
              </aside>
            </div>
            <div className="tip-banner"><div className="tip-icon"><Sparkles size={18} /></div><div><strong>Сделайте проект ещё удобнее</strong><span>Добавьте замеры помещения, чтобы подготовить основу для расчёта материалов.</span></div><button className="outline-button" onClick={() => openWizard('params')} type="button">Добавить замеры <Plus size={15} /></button></div>
          </div>
        )}

        {screen === 'wizard' && (
          <div className="page-wrap wizard-page">
            <section className="hero-heading wizard-heading">
              <div>
                <div className="eyebrow"><span className="orange-dot" /> ШАГ {STEP_ORDER.indexOf(wizardStep) + 1} ИЗ {STEP_ORDER.length}</div>
                <h1>{wizardStep === 'task' ? 'Что вы хотите сделать?' : wizardStep === 'params' ? 'Расскажите о помещении' : 'Выберите стиль и цвет'}</h1>
                <p>{wizardStep === 'task' ? 'Выберите задачу или опишите её своими словами.' : wizardStep === 'params' ? 'Размеры и состояние поверхностей помогут точнее подобрать материалы.' : 'Отметьте предпочтения — они помогут уточнить будущие рекомендации.'}</p>
              </div>
              <button className="outline-button" type="button" onClick={() => setScreen('dashboard')}>Выйти из формы</button>
            </section>

            <div className="wizard-stepper" aria-label="Этапы настройки проекта">
              {STEP_ORDER.map((step, index) => {
                const current = step === wizardStep;
                const done = index < STEP_ORDER.indexOf(wizardStep);
                return <div className={`wizard-step ${current ? 'current' : ''} ${done ? 'done' : ''}`} key={step} aria-current={current ? 'step' : undefined}>
                  <span className="wizard-step-number">{done ? <Check size={14} strokeWidth={3} /> : index + 1}</span>
                  <span>{STEP_LABELS[step]}</span>
                </div>;
              })}
            </div>

            {wizardStep === 'task' && <section className="wizard-panel">
              <div className="wizard-section-title"><h2>Выберите тип задачи</h2><p>Это отправная точка для будущего плана ремонта.</p></div>
              <div className="wizard-task-grid">
                {TASK_OPTIONS.map(({ id, label, description, icon: Icon }, index) => <button key={id} type="button" aria-pressed={draft.task === id} className={`wizard-task-card ${draft.task === id ? 'selected' : ''}`} onClick={() => updateDraft({ task: id })}>
                  <span className={`wizard-task-art tone-${index + 1}`}><Icon size={27} strokeWidth={1.7} /></span>
                  <span className="wizard-task-text"><strong>{label}</strong><small>{description}</small></span>
                  {draft.task === id && <span className="wizard-selected-mark"><Check size={13} strokeWidth={3} /></span>}
                </button>)}
              </div>
              <div className="wizard-field wizard-task-note">
                <label htmlFor="task-note">Дополнительно опишите задачу</label>
                <textarea id="task-note" rows={3} value={draft.taskNote} onChange={(event) => updateDraft({ taskNote: event.target.value })} placeholder="Например: хочу освежить стены, заменить плинтусы и подобрать краску, которую легко мыть." />
                {draft.task === 'other' && !draft.taskNote.trim() && <small className="wizard-hint">Для задачи «Другая задача» добавьте описание.</small>}
              </div>
            </section>}

            {wizardStep === 'params' && <section className="wizard-params-grid">
              <div className="wizard-panel wizard-metrics-panel">
                <div className="wizard-section-title"><h2>Размеры помещения</h2><p>Укажите размеры в метрах.</p></div>
                <div className="wizard-room-illustration" aria-hidden="true"><div className="wizard-room-back" /><div className="wizard-room-left" /><div className="wizard-room-right" /><span className="wizard-room-label length">{formatNumber(draft.room.lengthM)} м</span><span className="wizard-room-label width">{formatNumber(draft.room.widthM)} м</span><span className="wizard-room-label height">{formatNumber(draft.room.heightM)} м</span></div>
                <div className="wizard-dimensions-grid">
                  <NumberField id="room-length" label="Длина, м" value={draft.room.lengthM} min={1} max={20} onChange={(value) => updateRoom({ lengthM: value })} />
                  <NumberField id="room-width" label="Ширина, м" value={draft.room.widthM} min={1} max={20} onChange={(value) => updateRoom({ widthM: value })} />
                  <NumberField id="room-height" label="Высота, м" value={draft.room.heightM} min={2} max={5} onChange={(value) => updateRoom({ heightM: value })} />
                </div>
                <div className="wizard-metric-summary" aria-live="polite">
                  <div><span>Площадь пола</span><strong>{formatNumber(floorM2)} м²</strong></div>
                  <div><span>Площадь стен*</span><strong>{formatNumber(wallsM2)} м²</strong></div>
                </div>
                <p className="wizard-footnote">*Без вычета окон и дверей. Количество материалов и запас рассчитаем на следующем этапе.</p>
              </div>

              <div className="wizard-panel wizard-room-options">
                <div className="wizard-section-title"><h2>Особенности помещения</h2><p>Помогают выбрать подходящие материалы.</p></div>
                <fieldset className="wizard-fieldset">
                  <legend>Тип помещения</legend>
                  <div className="wizard-choice-row">
                    {ROOM_KINDS.map((item) => <button type="button" key={item.value} aria-pressed={draft.room.kind === item.value} className={`wizard-choice ${draft.room.kind === item.value ? 'selected' : ''}`} onClick={() => updateRoom({ kind: item.value })}>{item.label}</button>)}
                  </div>
                </fieldset>
                <fieldset className="wizard-fieldset">
                  <legend>Состояние стен</legend>
                  <div className="wizard-condition-list">
                    {WALL_OPTIONS.map((item) => <button type="button" key={item.value} aria-pressed={draft.room.wallCondition === item.value} className={`wizard-condition ${draft.room.wallCondition === item.value ? 'selected' : ''}`} onClick={() => updateRoom({ wallCondition: item.value })}>
                      <span className="wizard-radio-dot" /><span><strong>{item.label}</strong><small>{item.hint}</small></span>
                    </button>)}
                  </div>
                </fieldset>
                <fieldset className="wizard-fieldset">
                  <legend>Бюджет на материалы</legend>
                  <div className="wizard-budget-list">
                    {BUDGET_OPTIONS.map((item) => <button type="button" key={item.value} aria-pressed={draft.budget === item.value} className={`wizard-budget ${draft.budget === item.value ? 'selected' : ''}`} onClick={() => updateDraft({ budget: item.value })}><strong>{item.label}</strong><small>{item.detail}</small></button>)}
                  </div>
                </fieldset>
                <div className="wizard-specialist-row"><span><strong>Нужна помощь специалиста</strong><small>Учтём это предпочтение в рекомендациях.</small></span><button type="button" role="switch" aria-checked={draft.room.needsSpecialist} aria-label="Нужна помощь специалиста" className={`wizard-switch ${draft.room.needsSpecialist ? 'on' : ''}`} onClick={() => updateRoom({ needsSpecialist: !draft.room.needsSpecialist })}><span /></button></div>
              </div>
            </section>}

            {wizardStep === 'style' && <section className="wizard-panel">
              <div className="wizard-section-title"><h2>Какой стиль вам ближе?</h2><p>Выбор необязателен для расчёта площади, но поможет уточнить подбор материалов.</p></div>
              <div className="wizard-style-grid">
                {STYLE_OPTIONS.map((item, index) => <button type="button" key={item.value} aria-pressed={draft.style === item.value} className={`wizard-style-card ${draft.style === item.value ? 'selected' : ''}`} onClick={() => updateDraft({ style: item.value })}>
                  <span className={`wizard-style-art style-tone-${index + 1}`}>{item.value === 'custom' ? <Plus size={29} /> : <Sparkles size={26} strokeWidth={1.6} />}</span>
                  <span className="wizard-style-copy"><strong>{item.label}</strong><small>{item.description}</small></span>
                  {draft.style === item.value && <span className="wizard-selected-mark"><Check size={13} strokeWidth={3} /></span>}
                </button>)}
              </div>
              {draft.style === 'custom' && <div className="wizard-field wizard-custom-style"><label htmlFor="custom-style">Опишите стиль или пожелания</label><input id="custom-style" value={draft.customStyle} onChange={(event) => updateDraft({ customStyle: event.target.value })} placeholder="Например: светлый интерьер, тёплые акценты, без глянца" /></div>}
              <div className="wizard-palette-section">
                <div className="wizard-section-title"><h2>Цветовая палитра</h2><p>Можно выбрать один ориентир по цвету.</p></div>
                <div className="wizard-palette" role="group" aria-label="Цветовая палитра">
                  {PALETTE.map((color) => <button type="button" key={color.id} aria-pressed={draft.paletteId === color.id} aria-label={color.name} title={color.name} className={`wizard-swatch ${draft.paletteId === color.id ? 'selected' : ''}`} style={{ backgroundColor: color.hex }} onClick={() => updateDraft({ paletteId: color.id })}>{draft.paletteId === color.id && <Check size={15} />}</button>)}
                </div>
                <p className="wizard-palette-name">{PALETTE.find((color) => color.id === draft.paletteId)?.name ?? 'Цвет не выбран'}</p>
              </div>
            </section>}

            <div className="wizard-footer">
              <button className="outline-button" onClick={goBack} type="button"><ArrowLeft size={16} /> Назад</button>
              <button className="primary-button" onClick={goNext} disabled={!canContinue} type="button">{wizardStep === 'style' ? 'Сохранить параметры' : 'Далее'} <ArrowRight size={16} /></button>
            </div>
            {!canContinue && <p className="wizard-validation" role="status">{wizardStep === 'task' ? 'Выберите задачу или опишите её.' : wizardStep === 'params' ? 'Проверьте размеры помещения: длина и ширина от 1 до 20 м, высота от 2 до 5 м.' : 'Выберите стиль. Для «Своего варианта» заполните описание.'}</p>}
          </div>
        )}

        {screen === 'result' && (
          <div className="page-wrap wizard-page">
            <section className="hero-heading wizard-heading">
              <div><div className="eyebrow"><span className="orange-dot" /> ПАРАМЕТРЫ СОХРАНЕНЫ</div><h1>Основа проекта готова</h1><p>Вы сможете вернуться к параметрам и изменить их в любой момент.</p></div>
              <button className="outline-button" onClick={() => setScreen('dashboard')} type="button">К панели проекта</button>
            </section>
            <section className="wizard-result-grid">
              <div className="wizard-panel">
                <div className="wizard-section-title"><h2>{taskLabel(draft.task)}</h2><p>{draft.taskNote.trim() || 'Дополнительное описание задачи не указано.'}</p></div>
                <dl className="wizard-result-list">
                  <div><dt>Помещение</dt><dd>{roomKindLabel(draft.room.kind)}</dd></div>
                  <div><dt>Размеры</dt><dd>{formatNumber(draft.room.lengthM)} × {formatNumber(draft.room.widthM)} × {formatNumber(draft.room.heightM)} м</dd></div>
                  <div><dt>Площадь пола</dt><dd>{formatNumber(floorM2)} м²</dd></div>
                  <div><dt>Площадь стен*</dt><dd>{formatNumber(wallsM2)} м²</dd></div>
                  <div><dt>Состояние стен</dt><dd>{wallConditionLabel(draft.room.wallCondition)}</dd></div>
                  <div><dt>Бюджет</dt><dd>{budgetLabel(draft.budget)}</dd></div>
                  <div><dt>Стиль</dt><dd>{styleLabel(draft.style, draft.customStyle)}</dd></div>
                  <div><dt>Помощь специалиста</dt><dd>{draft.room.needsSpecialist ? 'Да' : 'Пока не требуется'}</dd></div>
                </dl>
                <p className="wizard-footnote">* Площадь стен указана без вычета окон и дверей.</p>
                <div className="wizard-result-actions"><button className="outline-button" type="button" onClick={() => openWizard('task')}><Pencil size={15} /> Изменить параметры</button><button className="primary-button" type="button" onClick={() => setScreen('dashboard')}>К панели проекта <ArrowRight size={15} /></button></div>
              </div>
              <aside className="wizard-next-card"><span className="wizard-next-icon"><Package size={24} /></span><h2>Следующий этап</h2><p>Подключим расчёт материалов, каталог товаров ОМА и смету. Пока здесь отображаются параметры формы, а не готовый расчёт.</p><ul><li>Подбор товаров из каталога</li><li>Расчёт необходимого количества</li><li>Разделение подтверждённых и ориентировочных цен</li></ul></aside>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function NumberField({ id, label, value, min, max, onChange }: NumberFieldProps) {
  const valid = Number.isFinite(value) && value >= min && value <= max;
  return <div className="wizard-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} type="number" inputMode="decimal" min={min} max={max} step="0.1" value={Number.isFinite(value) ? value : ''} aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined} onChange={(event) => onChange(event.target.value === '' ? Number.NaN : Number(event.target.value))} />
    {!valid && <small id={`${id}-error`} className="wizard-error">Введите число от {min} до {max} м.</small>}
  </div>;
}

export default App;
