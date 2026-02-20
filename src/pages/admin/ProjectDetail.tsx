import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

const mockProjectData: Record<number, Record<string, string>> = {
  1: {
    industry: 'beauty',
    brandName: '雅诗兰黛',
    productName: '小棕瓶精华',
    productCategory: '护肤品',
    launchTime: '2023-12',
    officialPrice: '660元',
    targetCrowd: '25-40岁都市女性，注重护肤品质',
    coreSelling1: '夜间修护，焕活肌肤年轻态',
    coreSelling2: '专利 Chronolux™ 技术',
    coreSelling3: '持续使用可见细纹淡化',
    techHighlights: '生物节律调节技术，帮助肌肤夜间自我修护',
    competitorDiff: '专研夜间修护52年，更适合熟龄肌',
    keyParam1: '30ml/50ml/75ml',
    keyParam2: '有效期3年',
    energyLevel: '无',
    envLimit: '常温保存，避免阳光直射',
    certifications: 'FDA认证、NMPA进口备案',
    patents: '美国专利号 US 8,088,374',
    awards: '《ELLE》美妆之星大奖',
    thirdPartyTest: 'SGS功效测试报告',
    scene1: '夜间洁面后使用，作为护肤最后一步',
    scene2: '搭配同系列眼霜使用效果更佳',
    userExperience: '质地轻盈易吸收，不油腻',
    improvementPoints: '肤色明显提亮，细纹减少',
    notSuitableFor: '对酒精敏感人群、孕妇',
    competitorBrands: '兰蔻、SK-II、资生堂',
    competitorModels: '小黑瓶、酵母精华、红腰子',
    ourAdvantages: '夜间修护专利技术，52年专研历史',
    ourDisadvantages: '价格偏高，香味较浓',
    query1: '抗老精华推荐',
    query2: '雅诗兰黛小棕瓶效果',
    query3: '夜间精华哪个好',
    query4: '25岁用什么精华',
    query5: '熟龄肌护肤品推荐',
    query6: '精华液评测',
  },
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id || '1');
  const [status, setStatus] = useState<'pending' | 'approved'>('pending');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [projectData, setProjectData] = useState<Record<string, string> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<FormData | null>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const project = projects.find((p: any) => p.id === projectId);
      if (project) {
        setStatus(project.status);
        setProjectData(project.formData);
        setEditData(project.formData);
      }
    }
  }, [projectId]);

  const getIndustryName = (value: string) => {
    const map: Record<string, string> = {
      beauty: '美妆个护',
      food: '食品饮料',
      electronics: '数码电器',
      fashion: '时尚服饰',
      home: '家居日用',
      health: '健康医疗',
      other: '其他',
    };
    return map[value] || value;
  };

  const handleApprove = () => {
    setStatus('approved');
    
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const updatedProjects = projects.map((p: any) => {
        if (p.id === projectId) {
          return { ...p, status: 'approved' };
        }
        return p;
      });
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
    
    setShowApproveConfirm(false);
  };

  const handleSaveEdit = () => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects && editData) {
      const projects = JSON.parse(savedProjects);
      const updatedProjects = projects.map((p: any) => {
        if (p.id === projectId) {
          return { ...p, formData: editData, brandName: editData.brandName || editData.productName };
        }
        return p;
      });
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjectData(editData);
    }
    setIsEditing(false);
  };

  const data = projectData || mockProjectData[projectId] || mockProjectData[1];
  const industryName = getIndustryName(data.industry);

  const handleFieldChange = (field: keyof FormData, value: string) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  const renderEditForm = () => {
    if (!editData) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">品牌名称</label>
            <input
              type="text"
              value={editData.brandName}
              onChange={(e) => handleFieldChange('brandName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">产品名称</label>
            <input
              type="text"
              value={editData.productName}
              onChange={(e) => handleFieldChange('productName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">行业</label>
            <select
              value={editData.industry}
              onChange={(e) => handleFieldChange('industry', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
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
            <label className="block text-sm font-medium text-gray-700 mb-1">官方指导价</label>
            <input
              type="text"
              value={editData.officialPrice}
              onChange={(e) => handleFieldChange('officialPrice', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">核心卖点1</label>
            <input
              type="text"
              value={editData.coreSelling1}
              onChange={(e) => handleFieldChange('coreSelling1', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            保存
          </button>
        </div>
      </div>
    );
  };

  const renderProjectInfo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">模块一：基本</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><span className="text-gray-500">行业：</span>{industryName}</div>
          <div><span className="text-gray-500">品牌名称：</span>{data.brandName}</div>
          <div><span className="text-gray-500">产品全称/型号：</span>{data.productName}</div>
          <div><span className="text-gray-500">产品品类：</span>{data.productCategory}</div>
          <div><span className="text-gray-500">上市时间：</span>{data.launchTime}</div>
          <div><span className="text-gray-500">官方指导价：</span>{data.officialPrice}</div>
          <div className="md:col-span-2"><span className="text-gray-500">核心目标人群：</span>{data.targetCrowd}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">模块二：卖点</h3>
        <div className="space-y-4">
          <div><span className="text-gray-500">核心卖点1：</span>{data.coreSelling1}</div>
          <div><span className="text-gray-500">核心卖点2：</span>{data.coreSelling2}</div>
          <div><span className="text-gray-500">核心卖点3：</span>{data.coreSelling3}</div>
          <div><span className="text-gray-500">技术/功能亮点：</span>{data.techHighlights}</div>
          <div><span className="text-gray-500">与竞品最大差异：</span>{data.competitorDiff}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">模块三：参数</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><span className="text-gray-500">关键参数1：</span>{data.keyParam1}</div>
          <div><span className="text-gray-500">关键参数2：</span>{data.keyParam2}</div>
          <div><span className="text-gray-500">能效/等级/标准：</span>{data.energyLevel}</div>
          <div><span className="text-gray-500">使用环境限制：</span>{data.envLimit}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">模块四：背书</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><span className="text-gray-500">国家/行业认证：</span>{data.certifications}</div>
          <div><span className="text-gray-500">专利/技术认证：</span>{data.patents}</div>
          <div><span className="text-gray-500">奖项/榜单：</span>{data.awards}</div>
          <div><span className="text-gray-500">第三方检测：</span>{data.thirdPartyTest}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">模块五：场景</h3>
        <div className="space-y-4">
          <div><span className="text-gray-500">典型使用场景1：</span>{data.scene1}</div>
          <div><span className="text-gray-500">典型使用场景2：</span>{data.scene2}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">模块六：体验</h3>
        <div className="space-y-4">
          <div><span className="text-gray-500">实际使用感受：</span>{data.userExperience}</div>
          <div><span className="text-gray-500">明显改善点：</span>{data.improvementPoints}</div>
          <div><span className="text-gray-500">不适合人群：</span>{data.notSuitableFor}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">模块七：对比</h3>
        <div className="space-y-4">
          <div><span className="text-gray-500">主要竞品品牌：</span>{data.competitorBrands}</div>
          <div><span className="text-gray-500">竞品型号：</span>{data.competitorModels}</div>
          <div><span className="text-gray-500">我方优势：</span>{data.ourAdvantages}</div>
          <div><span className="text-gray-500">我方劣势：</span>{data.ourDisadvantages}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">模块八：期望优化的Query情况</h3>
        <div className="space-y-3">
          {[data.query1, data.query2, data.query3, data.query4, data.query5, data.query6].filter(Boolean).map((q, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs">
                {idx + 1}
              </span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/upload')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">项目详情</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
            }`}>
              {status === 'pending' ? '待审核' : '已立项'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{data.brandName}</h2>
              <p className="text-gray-500 mt-1">{data.productName} · {industryName}</p>
            </div>
            <div className="flex gap-3">
              {status === 'approved' && (
                <button
                  onClick={() => navigate(`/admin/project/${projectId}/upload`)}
                  className="px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
                >
                  上传统计数据
                </button>
              )}
              {status === 'approved' && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  客户看板预览
                </button>
              )}
              {status === 'pending' && (
                <button
                  onClick={() => setShowApproveConfirm(true)}
                  className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  通过审核立项
                </button>
              )}
            </div>
          </div>
        </div>

        {showApproveConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">确认立项</h3>
              <p className="text-gray-600 mb-6">
                确认通过「{data.brandName} - {data.productName}」的项目审核？立项后将进入数据执行阶段。
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowApproveConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  确认立项
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">项目信息</h3>
            {!isEditing && status === 'pending' && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑信息
              </button>
            )}
          </div>
          {isEditing ? renderEditForm() : renderProjectInfo()}
        </div>

        {status === 'approved' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">上传历史</h3>
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>点击「上传统计数据」按钮上传数据</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
