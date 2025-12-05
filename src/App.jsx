import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  RefreshCw, 
  MessageCircle, 
  Share2, 
  CheckCircle, 
  User, 
  Briefcase, 
  Sparkles, 
  MapPin,
  ChevronDown,
  ChevronUp,
  Settings,
  Phone,
  Mail,
  AlertTriangle,
  Bot,
  X,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Building2,
  Smartphone,
  Lock
} from 'lucide-react';

// --- 常數設定 ---

// 已更新為指定的預設 Key
const DEFAULT_API_KEY = "AIzaSyDfRO2uM-o7drfn3nmNXqMBiLZm2JnA-Tc"; 

const TEAMS = [
  { value: "大橘團隊", label: "大橘團隊" },
  { value: "", label: "無 (不顯示)" }
];

const STORES = [
  { value: "", label: "無 (不顯示)" },
  { value: "有巢氏房屋13期復北立辰店", label: "有巢氏房屋13期復北立辰店" },
  { value: "永慶不動產台中公益大業店", label: "永慶不動產台中公益大業店" }
];

// 店頭法定資訊對照表
const STORE_INFOS = {
  "永慶不動產台中公益大業店": `永慶不動產台中公益大業加盟店\n敦璟開發股份有限公司\n張欽弼（102）中市經紀字第00145號`,
  "有巢氏房屋13期復北立辰店": `有巢氏房屋13期復北立辰加盟店\n立辰開發股份有限公司\n謝玲美(105)中市經紀字第01666號`
};

const SCENARIOS = [
  { value: "team_advantage", label: "🏆 團隊優勢 (三店連賣/行銷強)", icon: "💪", content: "三家店連賣、台中最大房產資訊網、多媒體行銷、短影音行銷、社群行銷、空拍、現廣等" },
  { value: "buyer_match", label: "🤝 精準買方 (我有客)", icon: "👥" },
  { value: "sold_report", label: "💰 成交報喜 (剛成交)", icon: "🎉" },
  { value: "local_news", label: "🏗️ 市場快訊 (台中利多)", icon: "📢" },
  { value: "vacant_dev", label: "🏠 閒置開發 (空屋活化)", icon: "🕸️" },
  { value: "old_house", label: "🏚️ 老屋換新 (危老都更)", icon: "🏗️" },
];

const PAIN_POINTS = [
  { value: "none", label: "無特別痛點 (通用)" },
  { value: "tax", label: "💸 稅務問題 (房地合一/土增稅)" },
  { value: "inheritance", label: "👨‍👩‍👧‍👦 繼承/分產問題" },
  { value: "vacant", label: "🏚️ 屋況變差/不想管理" },
  { value: "privacy", label: "🤫 低調賣/不想被鄰居知" },
  { value: "rezoning", label: "🚜 重劃區土地買賣" },
  { value: "cash_flow", label: "💰 現金周轉需求" },
  { value: "investment", label: "📈 投資獲利了結" },
];

const TONES = [
  { id: 'short', label: '簡訊/LINE', icon: '⚡', desc: '短促、多Emoji' },
  { id: 'neighbor', label: '像鄰居聊天', icon: '☕', desc: '口語、親切' },
  { id: 'sincere', label: '誠懇溫暖', icon: '❤️', desc: '有禮、同理心' },
  { id: 'professional', label: '專業數據', icon: '📊', desc: '客觀、分析' },
  { id: 'direct', label: '直球對決', icon: '🔥', desc: '單刀直入' },
  { id: 'urgent', label: '十萬火急', icon: '🚨', desc: '急迫、希望能盡快聯繫' },
];

const FORMATS = [
  { id: 'text', label: 'LINE/簡訊', icon: MessageCircle, desc: '簡短訊息為主，分段清楚' },
  { id: 'letter', label: '實體信函', icon: Mail, desc: '完整開發信，包含自我介紹與詳細說明' },
  { id: 'script', label: '電話話術', icon: Phone, desc: '電話開發，快狠準，不廢話' },
];

const LOCAL_NEWS_OPTIONS = [
  { value: "13_rezoning", label: "13期重劃區", keywords: "13期重劃區、低密度高綠覆、捷運綠線沿線、品牌建商進駐" },
  { value: "14_rezoning", label: "14期重劃區", keywords: "14期重劃區、漢神洲際百貨、台中巨蛋、高綠覆生活圈" },
  { value: "mrt_rezoning", label: "機捷重劃區", keywords: "機捷特區、好市多商圈、捷運總站、交通便利" },
  { value: "general_rezoning", label: "重劃區優勢", keywords: "新興重劃區、街廓整齊、增值潛力高、公共建設完善" },
  { value: "blue_line", label: "捷運藍線核定", keywords: "捷運藍線、交通利多、增值潛力" },
  { value: "tsmc", label: "台積電二期擴廠", keywords: "中科擴廠、工程師剛需、房價支撐" },
  { value: "shuinan", label: "水湳經貿園區", keywords: "水湳經貿、外溢效應、重大建設" },
  { value: "hanshin", label: "漢神洲際百貨", keywords: "漢神百貨、14期重劃區、生活機能" },
  { value: "74_road", label: "74號快速道路", keywords: "74號道、交通便利、生活圈擴大" },
];

const STRUCTURE_ITEMS = [
  { id: 'intro', label: '自我介紹 (我是誰)' },
  { id: 'pain', label: '痛點 (您擔心什麼)' },
  { id: 'scenario', label: '切入點 (我有什麼)' },
];

// --- 元件定義 ---

const InputGroup = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/50 mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-800 text-slate-200 font-medium hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-orange-500" />}
          {title}
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
};

const Label = ({ children }) => <label className="block text-xs font-medium text-slate-400 mb-1">{children}</label>;

const Input = (props) => (
  <input 
    {...props}
    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-600 transition-all"
  />
);

const Select = (props) => (
  <div className="relative">
    <select 
      {...props}
      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer transition-all"
    />
    <ChevronDown className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" size={16} />
  </div>
);

const MultiSelectChip = ({ label, selected, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg text-sm transition-all border flex items-center gap-2 text-left w-full ${
      selected 
      ? 'bg-orange-600/30 border-orange-500 text-orange-200 shadow-[0_0_10px_rgba(234,88,12,0.3)]' 
      : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
    }`}
  >
    <span>{selected ? '✅' : icon || '⬜'}</span>
    <span>{label}</span>
  </button>
);

// --- 邏輯處理 ---

const generateAIContent = async (data, apiKey) => {
  const { 
    agentName, agentPhone, teamName, storeName, targetName, community, scenarios, 
    tone, buyerType, buyerBudget, soldPrice, soldSpeed, 
    localNews, painPoints, format, structureOrder 
  } = data;

  const currentScenarios = scenarios.map(s => {
    const item = SCENARIOS.find(opt => opt.value === s);
    return item ? `${item.label} (內容重點: ${item.content || '無'})` : s;
  }).join(", ");

  const currentPainPoints = painPoints.map(p => {
    const item = PAIN_POINTS.find(opt => opt.value === p);
    return item ? item.label : p;
  }).join(", ");

  const currentTone = TONES.find(t => t.id === tone)?.label || tone;
  const currentFormat = FORMATS.find(f => f.id === format);
  const newsItem = LOCAL_NEWS_OPTIONS.find(n => n.value === localNews);
  
  const structureLabel = structureOrder.map(id => STRUCTURE_ITEMS.find(i => i.id === id)?.label).join(" -> ");

  // 取得店頭法定資訊
  const storeLegalInfo = STORE_INFOS[storeName] || "";

  let prompt = `
    Role: Professional Real Estate Agent in Taichung, Taiwan (Big Orange Team).
    Task: Write a sales copy for a property owner based on specific inputs.
    Language: Traditional Chinese (Taiwan), with Taichung local context.
    
    [Variables]
    - Agent Name: ${agentName}
    - Phone Number: ${agentPhone || "(請填寫電話)"}
    - Team: ${teamName}
    - Store: ${storeName}
    - Target Audience: ${targetName}
    - Community/Landmark: ${community || "該社區"}
    - Selected Scenarios (Cut-in Points): ${currentScenarios}
    - Selected Pain Points: ${currentPainPoints}
    - Tone/Style: ${currentTone}
    - Format: ${currentFormat?.label} (${currentFormat?.desc})
    - Structure Flow: ${structureLabel}
    
    [Details for Scenarios]
    ${scenarios.includes('buyer_match') ? `- Buyer Info: ${buyerType || "誠意買方"}, Budget: ${buyerBudget || "符合行情"}` : ''}
    ${scenarios.includes('sold_report') ? `- Sold Price: ${soldPrice || "保密"}, Speed: ${soldSpeed || "快速"}` : ''}
    ${scenarios.includes('local_news') ? `- Topic: ${newsItem?.label}, Keywords: ${newsItem?.keywords}` : ''}
    
    [Instructions]
    1. **Strictly follow the Structure Flow**: Organize the content in the order specified (${structureLabel}).
    2. **Format Specifics & Emoji Rules**:
       - If 'Phone Script': Use dialogue format (Agent: ... Owner: ...). Be concise, direct. **STRICTLY NO EMOJIS.**
       - If 'Letter': Formal business letter layout. Use standard punctuation. **STRICTLY NO EMOJIS.**
       - If 'LINE/SMS': You MAY use emojis (e.g., 🌟, 🏡) to make it engaging. Keep paragraphs short.
    3. **Content**:
       - Integrate ALL selected Scenarios and Pain Points naturally.
       - If "Team Advantage" is selected, mention: "三家店連賣、台中最大房產資訊網、多媒體行銷...".
       - Address pain points with empathy and professional solutions.
       - Ensure the content includes the Agent Name and Phone Number clearly at the end.
       ${storeLegalInfo ? `- **MANDATORY**: At the VERY BOTTOM of the message, you MUST append the following store legal information exactly as written:\n\n${storeLegalInfo}\n\n` : ''}
    4. **Output Style**: 
       - Generate ONLY plain text. 
       - **DO NOT use Markdown formatting** (NO **, ##, or bullet point symbols that look like markdown headers/bold). Use standard punctuation only.
       - Generate ONLY the final copy text. Do not add explanations.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error.message);
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "AI 生成無內容，請稍後再試。";
  } catch (error) {
    console.error("AI Error:", error);
    return `⚠️ AI 生成失敗：${error.message}\n\n請檢查 API Key 是否正確 (設定選單)，或是網路連線是否正常。`;
  }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [formData, setFormData] = useState({
    agentName: "",
    agentPhone: "", 
    teamName: "大橘團隊",
    storeName: "",
    targetName: "屋主大哥/大姐",
    community: "",
    scenarios: ["buyer_match"], 
    tone: "neighbor",
    format: "text",
    painPoints: ["none"], 
    structureOrder: ['intro', 'pain', 'scenario'],
    buyerType: "",
    buyerBudget: "",
    soldPrice: "",
    soldSpeed: "",
    localNews: "13_rezoning"
  });

  const [generatedText, setGeneratedText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(true);
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const outputRef = useRef(null); // Ref for scrolling

  const currentFormat = FORMATS.find(f => f.id === formData.format);
  const FormatIcon = currentFormat ? currentFormat.icon : MessageCircle;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScenarioToggle = (value) => {
    setFormData(prev => {
      const current = prev.scenarios;
      if (current.includes(value)) {
        return { ...prev, scenarios: current.filter(item => item !== value) }; 
      } else {
        return { ...prev, scenarios: [...current, value] }; 
      }
    });
  };

  const handlePainPointToggle = (value) => {
    setFormData(prev => {
      const current = prev.painPoints;
      if (value === 'none') return { ...prev, painPoints: ['none'] };
      
      let newPoints = current.includes('none') ? [] : [...current];
      
      if (newPoints.includes(value)) {
        newPoints = newPoints.filter(item => item !== value);
      } else {
        newPoints.push(value);
      }
      
      if (newPoints.length === 0) newPoints = ['none'];
      
      return { ...prev, painPoints: newPoints };
    });
  };

  const moveStructure = (index, direction) => {
    setFormData(prev => {
      const newOrder = [...prev.structureOrder];
      if (direction === 'up' && index > 0) {
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      } else if (direction === 'down' && index < newOrder.length - 1) {
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      }
      return { ...prev, structureOrder: newOrder };
    });
  };

  const handleReset = () => {
    setFormData({
      agentName: "",
      agentPhone: "",
      teamName: "大橘團隊",
      storeName: "",
      targetName: "屋主大哥/大姐",
      community: "",
      scenarios: ["buyer_match"],
      tone: "neighbor",
      format: "text",
      painPoints: ["none"],
      structureOrder: ['intro', 'pain', 'scenario'],
      buyerType: "",
      buyerBudget: "",
      soldPrice: "",
      soldSpeed: "",
      localNews: "13_rezoning"
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === "8899") {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const generate = async () => {
    if (!apiKey) {
        setShowSettings(true);
        alert("請先設定 API Key");
        return;
    }

    setIsLoading(true);
    
    // Auto scroll to output (Right panel)
    if (outputRef.current) {
      setTimeout(() => {
        outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    const text = await generateAIContent(formData, apiKey);
    setGeneratedText(text);
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(generatedText)
        .then(() => triggerToast())
        .catch(err => fallbackCopyTextToClipboard(generatedText));
    } else {
      fallbackCopyTextToClipboard(generatedText);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      if (successful) triggerToast();
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Fallback copy error:', err);
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(generatedText)}`;

  // 登入介面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-slate-700/50 shadow-inner">
              <Lock size={32} className="text-orange-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">房仲開發信產生器 <span className="text-orange-500 text-sm">PRO</span></h2>
          <p className="text-slate-400 text-center text-sm mb-6">請輸入密碼以繼續使用</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="請輸入密碼"
                className={`w-full bg-slate-900 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-center tracking-widest placeholder:tracking-normal placeholder:text-slate-600 ${loginError ? 'border-red-500' : 'border-slate-700'}`}
                autoFocus
              />
            </div>
            
            {loginError && (
              <div className="text-red-400 text-xs text-center flex items-center justify-center gap-1 animate-pulse">
                <AlertTriangle size={12} /> 密碼錯誤，請重新輸入
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-orange-500/20"
            >
              進入系統
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-slate-500">
             Dajuteam xcrab
          </div>
        </div>
      </div>
    );
  }

  // 主程式
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30 pb-10">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg shadow-lg bg-gradient-to-br from-orange-500 to-red-600`}>
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                房仲開發信產生器 <span className="text-orange-500 text-xs">PRO</span>
              </h1>
              <p className="text-xs text-slate-400">大橘團隊 x XCRAB AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Settings size={20} />
              <span className="hidden md:inline text-xs">{apiKey === DEFAULT_API_KEY ? '使用預設 Key' : '自訂 Key'}</span>
            </button>
            <button 
              onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
            >
              <ChevronDown size={20} className={`transform transition-transform ${isMobilePanelOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Settings size={18} /> 設定 AI 金鑰
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-300">
                請輸入您的 Google Gemini API Key 以啟用 AI 功能。
              </p>
              <div>
                <Label>Google Gemini API Key</Label>
                <Input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..." 
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <button 
                  onClick={() => setApiKey(DEFAULT_API_KEY)}
                  className="text-orange-400 hover:underline"
                >
                  恢復預設值
                </button>
                <span className="text-slate-500">Key 僅存於瀏覽器記憶體</span>
              </div>
            </div>
            <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-end">
              <button 
                onClick={() => setShowSettings(false)}
                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Panel: Inputs */}
        <div className={`md:w-1/3 lg:w-1/4 space-y-4 ${isMobilePanelOpen ? 'block' : 'hidden md:block'}`}>
          
          <InputGroup title="1. 業務姓名與團隊" icon={User}>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <Label>業務姓名</Label>
                  <Input name="agentName" value={formData.agentName} onChange={handleChange} placeholder="輸入您的稱呼 (例: 小陳)" />
                </div>
                <div>
                  <Label>聯絡電話</Label>
                  <div className="relative">
                    <Input name="agentPhone" value={formData.agentPhone} onChange={handleChange} placeholder="09xx-xxx-xxx" />
                    <Smartphone className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label>團隊名稱</Label>
                  <Select name="teamName" value={formData.teamName} onChange={handleChange}>
                    {TEAMS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>分店名稱</Label>
                  <Select name="storeName" value={formData.storeName} onChange={handleChange}>
                    {STORES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </Select>
                </div>
              </div>
            </div>
          </InputGroup>

          <InputGroup title="2. 切入點 (複選)" icon={Briefcase}>
            <div>
              <Label>目標稱呼</Label>
              <Input name="targetName" value={formData.targetName} onChange={handleChange} placeholder="屋主大哥" />
            </div>
            
            <div className="mt-2">
              <Label>社區 / 地標 / 區域 / 類型</Label>
              <Input 
                name="community" 
                value={formData.community} 
                onChange={handleChange} 
                placeholder="例如：惠宇觀市政、七期、南區、農地..." 
              />
              <p className="text-[10px] text-slate-500 mt-1">
                💡 提示：可輸入具體社區，也可以輸入區域（如：七期、南區）或是物件類型（如：農地、重劃區）。
              </p>
            </div>
            
            <div className="mt-3">
              <Label>選擇開發切入點 (可多選)</Label>
              <div className="grid grid-cols-1 gap-2 mt-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {SCENARIOS.map(s => (
                  <MultiSelectChip
                    key={s.value}
                    label={s.label}
                    icon={s.icon}
                    selected={formData.scenarios.includes(s.value)}
                    onClick={() => handleScenarioToggle(s.value)}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Inputs */}
            <div className="pt-2 border-t border-slate-700/50 mt-2 space-y-3">
              {formData.scenarios.includes('buyer_match') && (
                <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 animate-in fade-in space-y-2">
                  <p className="text-xs text-orange-400 font-bold mb-1">👥 買方設定</p>
                  <div>
                    <Label>買方背景</Label>
                    <Input name="buyerType" value={formData.buyerType} onChange={handleChange} placeholder="例如：中科工程師" />
                  </div>
                  <div>
                    <Label>買方預算 (萬)</Label>
                    <Input name="buyerBudget" value={formData.buyerBudget} onChange={handleChange} placeholder="例如：2500" type="number" />
                  </div>
                </div>
              )}
              {formData.scenarios.includes('sold_report') && (
                <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 animate-in fade-in space-y-2">
                    <p className="text-xs text-orange-400 font-bold mb-1">🎉 成交設定</p>
                  <div>
                    <Label>成交總價 (萬)</Label>
                    <Input name="soldPrice" value={formData.soldPrice} onChange={handleChange} placeholder="例如：3200" type="number" />
                  </div>
                  <div>
                    <Label>成交速度</Label>
                    <Input name="soldSpeed" value={formData.soldSpeed} onChange={handleChange} placeholder="例如：三天秒殺" />
                  </div>
                </div>
              )}
               {formData.scenarios.includes('local_news') && (
                <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 animate-in fade-in">
                  <p className="text-xs text-orange-400 font-bold mb-1">📢 話題設定</p>
                  <Label>選擇話題</Label>
                  <Select name="localNews" value={formData.localNews} onChange={handleChange}>
                    {LOCAL_NEWS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </Select>
                </div>
              )}
            </div>
          </InputGroup>

          <InputGroup title="3. 策略與痛點 (複選)" icon={Bot}>
             <div>
              <Label>屋主痛點猜測 (可多選)</Label>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {PAIN_POINTS.map(p => (
                   <MultiSelectChip
                    key={p.value}
                    label={p.label}
                    selected={formData.painPoints.includes(p.value)}
                    onClick={() => handlePainPointToggle(p.value)}
                  />
                ))}
              </div>
            </div>
          </InputGroup>

          <InputGroup title="4. 語氣與格式" icon={MessageCircle}>
            <div className="space-y-5">
              
              {/* Output Format */}
              <div>
                <Label>輸出格式 (Output Format)</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {FORMATS.map(fmt => (
                    <button
                      key={fmt.id}
                      onClick={() => setFormData(prev => ({ ...prev, format: fmt.id }))}
                      className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${
                        formData.format === fmt.id 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                      title={fmt.desc}
                    >
                      <fmt.icon size={16} className="mb-1" />
                      <span className="text-xs">{fmt.label.split('/')[0]}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {FORMATS.find(f => f.id === formData.format)?.desc}
                </p>
              </div>

              {/* Structure Ordering */}
              <div>
                <Label>文案結構順序 (點箭頭調整)</Label>
                <div className="bg-slate-900 rounded border border-slate-700 p-2 space-y-1 mt-1">
                  {formData.structureOrder.map((itemId, index) => {
                    const item = STRUCTURE_ITEMS.find(i => i.id === itemId);
                    return (
                      <div key={itemId} className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded text-sm text-slate-300">
                        <span>{index + 1}. {item?.label}</span>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => moveStructure(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-slate-700 rounded disabled:opacity-30"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button 
                            onClick={() => moveStructure(index, 'down')}
                            disabled={index === formData.structureOrder.length - 1}
                            className="p-1 hover:bg-slate-700 rounded disabled:opacity-30"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tone */}
              <div>
                <Label>語氣風格 (Tone)</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {TONES.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setFormData(prev => ({ ...prev, tone: mode.id }))}
                      className={`flex items-center gap-2 px-2 py-2 rounded border transition-all text-left ${
                        formData.tone === mode.id 
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg">{mode.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{mode.label}</span>
                        <span className="text-[9px] opacity-70">{mode.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </InputGroup>
          
          <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 p-2 bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded-lg border border-transparent hover:border-red-900/50 transition-all text-sm mb-3"
          >
            <RotateCcw size={14} /> 重置所有設定
          </button>

          <button 
            onClick={generate}
            className="w-full flex items-center justify-center gap-2 p-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-base border border-orange-500 animate-in fade-in zoom-in-95"
          >
            <Sparkles size={18} /> AI 立即產出
          </button>

        </div>

        {/* Right Panel: Output */}
        <div ref={outputRef} className="md:w-2/3 lg:w-3/4 flex flex-col h-full min-h-[500px]">
          
          {/* Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl flex flex-col h-full overflow-hidden relative">
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center flex-col gap-3">
                <RefreshCw className="animate-spin text-orange-500" size={40} />
                <p className="text-orange-400 font-medium animate-pulse">
                  AI 正在組裝最強文案...
                </p>
                <p className="text-slate-400 text-xs">正在分析：{formData.scenarios.length} 個切入點、{formData.painPoints.length} 個痛點</p>
              </div>
            )}

            {/* Toolbar */}
            <div className="p-4 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 backdrop-blur">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[60%]">
                <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider uppercase flex-shrink-0 flex items-center gap-1 ${
                  formData.format === 'text' ? 'bg-green-500/20 text-green-400' :
                  formData.format === 'letter' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-pink-500/20 text-pink-400'
                }`}>
                  <FormatIcon size={12} />
                  {currentFormat?.label.split('/')[0]}
                </span>
                
                {formData.scenarios.length > 0 && (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400 flex-shrink-0">
                    {formData.scenarios.length} 個切入點
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                 <button 
                  onClick={generate}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg transition-all border shadow-lg active:scale-95 bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600"
                >
                  <RefreshCw size={14} />
                  <span>重新生成</span>
                </button>
              </div>
            </div>

            {/* Text Area */}
            <div className="flex-1 relative group bg-slate-900/50">
              <textarea
                id="output-textarea"
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                placeholder="等待生成中... 請設定左側參數並點擊左下角的「AI 立即產出」"
                className="w-full h-full min-h-[500px] p-6 bg-transparent text-slate-100 text-base leading-relaxed resize-y focus:outline-none transition-opacity font-mono"
                spellCheck="false"
              />
              {generatedText && (
                <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded">可直接編輯</span>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-slate-800 border-t border-slate-700 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all active:scale-95 border border-slate-600"
              >
                {showToast ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
                {showToast ? '已複製！' : '複製文案'}
              </button>
              
              <a 
                href={lineShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#05b54d] text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-green-500/20 transition-all active:scale-95"
              >
                <Share2 size={20} />
                <span className="hidden sm:inline">LINE 分享</span>
                <span className="sm:hidden">LINE</span>
              </a>
            </div>

          </div>

          <div className="mt-4 text-center text-slate-500 text-xs flex flex-col gap-1">
             <p>💡 提示：按住生成框右下角可自由拖拉高度。不滿意結果？點擊 <RefreshCw className="inline" size={12}/> 可請 AI 重新潤飾。</p>
          </div>

        </div>
      </main>

      {/* Toast Notification */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-xl border border-slate-700 flex items-center gap-2 transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <CheckCircle size={16} className="text-green-500" />
        <span className="text-sm font-medium">文案已複製到剪貼簿</span>
      </div>

    </div>
  );
}