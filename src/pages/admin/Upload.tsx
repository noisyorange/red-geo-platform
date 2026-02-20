import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  brandName: string;
  productName: string;
  industry: string;
  status: 'pending' | 'approved';
  submitTime: string;
}

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const pendingCount = projects.filter(p => p.status === 'pending').length;
  const approvedCount = projects.filter(p => p.status === 'approved').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">项目管理</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">运营人员</span>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
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
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
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
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              {filter === 'all' ? '全部项目' : filter === 'pending' ? '待审核项目' : '已立项项目'}
            </h2>
          </div>
          
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              暂无项目
            </div>
          ) : (
            <div className="divide-y">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/project/${project.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      project.status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      {project.status === 'pending' ? (
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{project.brandName}</h3>
                      <p className="text-sm text-gray-500">{project.productName} · {project.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{project.submitTime}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-green-100 text-green-700'
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
