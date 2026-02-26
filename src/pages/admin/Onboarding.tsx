import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface FormData {
  industry: string;
  brandName: string;
  productName: string;
  productCategory: string;
  launchTime: string;
  officialPrice: string;
  targetCrowd: string;
  
  coreSelling1: string;
  coreSelling2: string;
  coreSelling3: string;
  techHighlights: string;
  competitorDiff: string;
  
  keyParam1: string;
  keyParam2: string;
  energyLevel: string;
  envLimit: string;
  
  certifications: string;
  patents: string;
  awards: string;
  thirdPartyTest: string;
  
  scene1: string;
  scene2: string;
  
  userExperience: string;
  improvementPoints: string;
  notSuitableFor: string;
  
  competitorBrands: string;
  competitorModels: string;
  ourAdvantages: string;
  ourDisadvantages: string;
  
  query1: string;
  query2: string;
  query3: string;
  query4: string;
  query5: string;
  query6: string;
}

const initialFormData: FormData = {
  industry: '',
  brandName: '',
  productName: '',
  productCategory: '',
  launchTime: '',
  officialPrice: '',
  targetCrowd: '',
  coreSelling1: '',
  coreSelling2: '',
  coreSelling3: '',
  techHighlights: '',
  competitorDiff: '',
  keyParam1: '',
  keyParam2: '',
  energyLevel: '',
  envLimit: '',
  certifications: '',
  patents: '',
  awards: '',
  thirdPartyTest: '',
  scene1: '',
  scene2: '',
  userExperience: '',
  improvementPoints: '',
  notSuitableFor: '',
  competitorBrands: '',
  competitorModels: '',
  ourAdvantages: '',
  ourDisadvantages: '',
  query1: '',
  query2: '',
  query3: '',
  query4: '',
  query5: '',
  query6: '',
};

const modules = [
  { id: 1, name: '基本', icon: '📋' },
  { id: 2, name: '卖点', icon: '💡' },
  { id: 3, name: '参数', icon: '⚙️' },
  { id: 4, name: '背书', icon: '🏆' },
  { id: 5, name: '场景', icon: '🎬' },
  { id: 6, name: '体验', icon: '✨' },
  { id: 7, name: '对比', icon: '⚔️' },
  { id: 8, name: 'Query优化', icon: '🔍' },
];

export default function ProjectApplication() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: existingProjects } = await supabase
        .from('projects')
        .select('id')
        .eq('user_email', user?.email);
      
      if (existingProjects && existingProjects.length > 0) {
        alert('您已提交过项目，请等待审核或联系运营人员');
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          brand_name: formData.brandName || formData.productName,
          product_name: formData.productName,
          industry: formData.industry,
          status: 'pending',
          form_data: formData,
          user_email: user?.email || '',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        localStorage.setItem('currentProjectId', data.id.toString());
      }
      
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      alert('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderModuleForm = () => {
    switch (activeModule) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">模块一：基本</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">行业 <span className="text-red-500">*</span></label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">请选择行业</option>
                  <option value="beauty">美妆个护</option>
                  <option value="food">食品饮料</option>
                  <option value="electronics">数码电器</option>
                  <option value="fashion">时尚服饰</option>
                  <option value="home">家居日用</option>
                  <option value="health">健康医疗</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">品牌名称 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => handleChange('brandName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请输入品牌名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品全称/型号</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => handleChange('productName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请输入产品全称或型号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品品类</label>
                <input
                  type="text"
                  value={formData.productCategory}
                  onChange={(e) => handleChange('productCategory', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请输入产品品类"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">上市时间</label>
                <input
                  type="month"
                  value={formData.launchTime}
                  onChange={(e) => handleChange('launchTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">官方指导价</label>
                <input
                  type="text"
                  value={formData.officialPrice}
                  onChange={(e) => handleChange('officialPrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="如：299元"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">核心目标人群</label>
                <input
                  type="text"
                  value={formData.targetCrowd}
                  onChange={(e) => handleChange('targetCrowd', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请描述核心目标人群特征"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">模块二：卖点</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">核心卖点1（一句话） <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.coreSelling1}
                  onChange={(e) => handleChange('coreSelling1', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请用一句话描述产品最核心的卖点"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">核心卖点2</label>
                <input
                  type="text"
                  value={formData.coreSelling2}
                  onChange={(e) => handleChange('coreSelling2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请描述第二个核心卖点"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">核心卖点3</label>
                <input
                  type="text"
                  value={formData.coreSelling3}
                  onChange={(e) => handleChange('coreSelling3', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请描述第三个核心卖点"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">技术/功能亮点</label>
                <textarea
                  value={formData.techHighlights}
                  onChange={(e) => handleChange('techHighlights', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24"
                  placeholder="请描述产品的技术或功能亮点"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">与竞品最大差异</label>
                <textarea
                  value={formData.competitorDiff}
                  onChange={(e) => handleChange('competitorDiff', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24"
                  placeholder="请描述与竞品最大的差异点"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">模块三：参数</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">关键参数1</label>
                <input
                  type="text"
                  value={formData.keyParam1}
                  onChange={(e) => handleChange('keyParam1', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请输入关键参数"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">关键参数2</label>
                <input
                  type="text"
                  value={formData.keyParam2}
                  onChange={(e) => handleChange('keyParam2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请输入关键参数"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">能效/等级/标准</label>
                <input
                  type="text"
                  value={formData.energyLevel}
                  onChange={(e) => handleChange('energyLevel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="如：一级能效、AAA级认证等"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">使用环境限制</label>
                <input
                  type="text"
                  value={formData.envLimit}
                  onChange={(e) => handleChange('envLimit', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="如：室内使用、防水等级等"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">模块四：背书</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">国家/行业认证</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => handleChange('certifications', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="如：3C认证、ISO9001等"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">专利/技术认证</label>
                <input
                  type="text"
                  value={formData.patents}
                  onChange={(e) => handleChange('patents', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请列出专利或技术认证"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">奖项/榜单</label>
                <input
                  type="text"
                  value={formData.awards}
                  onChange={(e) => handleChange('awards', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="如：红点设计奖、最受欢迎产品等"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">第三方检测</label>
                <input
                  type="text"
                  value={formData.thirdPartyTest}
                  onChange={(e) => handleChange('thirdPartyTest', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="如：SGS检测报告等"
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">模块五：场景</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">典型使用场景1 <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.scene1}
                  onChange={(e) => handleChange('scene1', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24"
                  placeholder="请描述产品最典型的使用场景"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">典型使用场景2</label>
                <textarea
                  value={formData.scene2}
                  onChange={(e) => handleChange('scene2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24"
                  placeholder="请描述第二个典型使用场景"
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">模块六：体验</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">实际使用感受</label>
                <textarea
                  value={formData.userExperience}
                  onChange={(e) => handleChange('userExperience', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24"
                  placeholder="请描述用户的实际使用感受"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">明显改善点</label>
                <textarea
                  value={formData.improvementPoints}
                  onChange={(e) => handleChange('improvementPoints', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24"
                  placeholder="请描述使用后带来的明显改善"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">不适合人群</label>
                <textarea
                  value={formData.notSuitableFor}
                  onChange={(e) => handleChange('notSuitableFor', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24"
                  placeholder="请描述不适合使用本产品的人群"
                />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">模块七：对比</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">主要竞品品牌</label>
                <input
                  type="text"
                  value={formData.competitorBrands}
                  onChange={(e) => handleChange('competitorBrands', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请列出主要竞争对手品牌"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">竞品型号</label>
                <input
                  type="text"
                  value={formData.competitorModels}
                  onChange={(e) => handleChange('competitorModels', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="请列出竞品型号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">我方优势</label>
                <textarea
                  value={formData.ourAdvantages}
                  onChange={(e) => handleChange('ourAdvantages', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24"
                  placeholder="请描述相对于竞品的优势"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">我方劣势</label>
                <textarea
                  value={formData.ourDisadvantages}
                  onChange={(e) => handleChange('ourDisadvantages', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none h-24"
                  placeholder="请描述相对于竞品的劣势（可后续优化）"
                />
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">模块八：期望优化的Query情况</h3>
            <p className="text-gray-500 text-sm">请列出希望优化的小红书搜索关键词，用户在搜索这些关键词时希望看到您的产品</p>
            <div className="space-y-4">
              {['query1', 'query2', 'query3', 'query4', 'query5', 'query6'].map((q, idx) => (
                <div key={q} className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={formData[q as keyof FormData]}
                    onChange={(e) => handleChange(q as keyof FormData, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                    placeholder={`请输入期望优化的Query ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">提交成功！</h2>
          <p className="text-gray-500 mb-6">您的项目信息已提交，等待运营人员审核。</p>
          <p className="text-sm text-gray-400 mb-6">审核结果将短信通知您，请留意</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              返回首页
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              返回登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-base sm:text-xl font-bold text-gray-800">项目信息确认表</h1>
          </div>
          <span className="text-gray-500 text-xs sm:text-sm">请完整填写以下信息</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-2 overflow-x-auto pb-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeModule === module.id
                      ? 'bg-pink-50 text-pink-700 border-l-4 border-pink-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{module.icon}</span>
                  <span className="font-medium">{module.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 bg-white rounded-xl shadow-sm p-8">
            {renderModuleForm()}
            
            <div className="mt-8 flex justify-between pt-6 border-t">
              <button
                onClick={() => setActiveModule(Math.max(1, activeModule - 1))}
                disabled={activeModule === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一步
              </button>
              <button
                onClick={() => {
                  if (activeModule < 8) {
                    setActiveModule(activeModule + 1);
                  } else {
                    handleSubmit();
                  }
                }}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                {activeModule < 8 ? '下一步' : '提交'}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
