import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Project } from '../../lib/supabase';

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'deleted'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Load projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const pendingCount = projects.filter(p => p.status === 'pending').length;
  const approvedCount = projects.filter(p => p.status === 'approved').length;
  const deletedCount = projects.filter(p => p.status === 'deleted').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-xl font-bold text-gray-800">项目管理</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-base text-gray-600">运营人员</span>
            <button
              onClick={() => navigate('/login')}
              className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base text-gray-600 hover:text-gray-800"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setFilter('all')}
            className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-pink-500' : 'hover:shadow-md'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">全部项目</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{loading ? '...' : projects.length}</p>
          </div>

          <div 
            onClick={() => setFilter('pending')}
            className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all ${filter === 'pending' ? 'ring-2 ring-pink-500' : 'hover:shadow-md'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">待审核</span>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{loading ? '...' : pendingCount}</p>
          </div>

          <div 
            onClick={() => setFilter('approved')}
            className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all ${filter === 'approved' ? 'ring-2 ring-pink-500' : 'hover:shadow-md'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">已立项</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{loading ? '...' : approvedCount}</p>
          </div>

          <div 
            onClick={() => setFilter('deleted')}
            className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all ${filter === 'deleted' ? 'ring-2 ring-pink-500' : 'hover:shadow-md'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">已删除</span>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{loading ? '...' : deletedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">项目列表</h2>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无项目</div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/admin/project/${project.id}`)}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors gap-3"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{project.brand_name}</h3>
                    <p className="text-sm text-gray-500">{project.product_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                      project.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {project.status === 'pending' ? '待审核' : '已立项'}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
