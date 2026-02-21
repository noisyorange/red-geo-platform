import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { supabase, Project, ProjectData, ExcelRow } from '../lib/supabase';

interface BrandStats {
  name: string;
  totalAppearances: number;
  position1: number;
  position2: number;
  position3: number;
  position4: number;
  position5: number;
  frequency: number;
  avgPosition: number;
  exposureRate: number;
  firstPositionRate: number;
}

interface QueryTrend {
  query: string;
  trends: Array<{
    time: string;
    exposureRate: number;
    position: number;
  }>;
}

const mockExcelData: ExcelRow[] = [
  { id: 1, query_time: '2024-01-15', query: '性价比高的智能床推荐', brand1: '舒达', brand2: '丝涟', brand3: '金可儿', brand4: '慕思', brand5: '喜临门', ai_content: '智能床推荐：舒达、丝涟，金可儿...', geo_summary: '品牌在搜索结果中曝光良好，前三位置被知名品牌占据' },
  { id: 2, query_time: '2024-01-15', query: '智能床品牌排行', brand1: '舒达', brand2: '丝涟', brand3: '金可儿', brand4: '慕思', brand5: '喜临门', ai_content: '智能床排行：舒达、丝涟，金可儿...', geo_summary: '品牌在搜索结果中曝光良好，前三位置被知名品牌占据' },
  { id: 3, query_time: '2024-01-15', query: '高端智能床哪个好', brand1: '丝涟', brand2: '舒达', brand3: '金可儿', brand4: '慕思', brand5: '喜临门', ai_content: '高端智能床推荐：丝涟、舒达...', geo_summary: '丝涟升至第一，舒达第二' },
  { id: 4, query_time: '2024-01-15', query: '智能床推荐性价比', brand1: '慕思', brand2: '舒达', brand3: '喜临门', brand4: '金可儿', brand5: '丝涟', ai_content: '性价比智能床推荐：慕思、舒达...', geo_summary: '慕思在性价比搜索中表现突出' },
  { id: 5, query_time: '2024-01-15', query: '国产智能床品牌', brand1: '喜临门', brand2: '慕思', brand3: '舒达', brand4: '丝涟', brand5: '金可儿', ai_content: '国产智能床推荐：喜临门、慕思...', geo_summary: '国产品牌在本土搜索中表现强劲' },
  { id: 6, query_time: '2024-01-20', query: '性价比高的智能床推荐', brand1: '舒达', brand2: '慕思', brand3: '丝涟', brand4: '金可儿', brand5: '喜临门', ai_content: '智能床推荐：舒达、慕思、丝涟...', geo_summary: '舒达保持第一，慕思上升至第二' },
  { id: 7, query_time: '2024-01-20', query: '智能床品牌排行', brand1: '舒达', brand2: '丝涟', brand3: '金可儿', brand4: '慕思', brand5: '喜临门', ai_content: '智能床排行：舒达、丝涟、金可儿...', geo_summary: '品牌格局稳定' },
  { id: 8, query_time: '2024-01-20', query: '高端智能床哪个好', brand1: '舒达', brand2: '丝涟', brand3: '金可儿', brand4: '慕思', brand5: '喜临门', ai_content: '高端智能床推荐：舒达、丝涟...', geo_summary: '舒达在高端市场稳固领先' },
  { id: 9, query_time: '2024-01-20', query: '智能床推荐性价比', brand1: '慕思', brand2: '舒达', brand3: '喜临门', brand4: '金可儿', brand5: '丝涟', ai_content: '性价比智能床推荐：慕思、舒达...', geo_summary: '慕思保持性价比优势' },
  { id: 10, query_time: '2024-01-20', query: '国产智能床品牌', brand1: '喜临门', brand2: '慕思', brand3: '舒达', brand4: '丝涟', brand5: '金可儿', ai_content: '国产智能床推荐：喜临门、慕思...', geo_summary: '国产品牌稳定' },
  { id: 11, query_time: '2024-01-25', query: '性价比高的智能床推荐', brand1: '慕思', brand2: '舒达', brand3: '丝涟', brand4: '喜临门', brand5: '金可儿', ai_content: '智能床推荐：慕思、舒达、丝涟...', geo_summary: '慕思首次在核心关键词获得第一' },
  { id: 12, query_time: '2024-01-25', query: '智能床品牌排行', brand1: '舒达', brand2: '慕思', brand3: '丝涟', brand4: '金可儿', brand5: '喜临门', ai_content: '智能床排行：舒达、慕思、丝涟...', geo_summary: '慕思上升至第二' },
  { id: 13, query_time: '2024-01-25', query: '高端智能床哪个好', brand1: '舒达', brand2: '丝涟', brand3: '金可儿', brand4: '慕思', brand5: '喜临门', ai_content: '高端智能床推荐：舒达、丝涟...', geo_summary: '高端市场稳定' },
  { id: 14, query_time: '2024-01-25', query: '智能床推荐性价比', brand1: '慕思', brand2: '喜临门', brand3: '舒达', brand4: '金可儿', brand5: '丝涟', ai_content: '性价比智能床推荐：慕思、喜临门...', geo_summary: '喜临门性价比突出' },
  { id: 15, query_time: '2024-01-25', query: '国产智能床品牌', brand1: '喜临门', brand2: '慕思', brand3: '舒达', brand4: '丝涟', brand5: '金可儿', ai_content: '国产智能床推荐：喜临门、慕思...', geo_summary: '国产品牌稳定' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [projectStatus, setProjectStatus] = useState<'no-project' | 'pending' | 'approved' | 'data-ready'>('no-project');
  const [projectName, setProjectName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [projectBrand, setProjectBrand] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('');
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, []);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      const projectId = localStorage.getItem('currentProjectId');
      
      if (!projectId) {
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (projects && projects.length > 0) {
          const project = projects[0];
          setProjectName(project.brand_name || project.product_name);
          setProjectBrand(project.brand_name || '舒达');
          
          if (project.status === 'approved') {
            await loadProjectDataItems(project.id);
          } else {
            setProjectStatus('pending');
          }
        } else {
          setProjectStatus('no-project');
        }
      } else {
        const { data: project, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', parseInt(projectId))
          .single();
        
        if (project) {
          setProjectName(project.brand_name || project.product_name);
          setProjectBrand(project.brand_name || '舒达');
          
          if (project.status === 'approved') {
            await loadProjectDataItems(project.id);
          } else {
            setProjectStatus('pending');
          }
        } else {
          setProjectStatus('no-project');
        }
      }
    } catch (err) {
      console.error('Load project error:', err);
      setProjectStatus('no-project');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDataItems = async (projectId: number) => {
    try {
      const { data: projectData } = await supabase
        .from('project_data')
        .select('data')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (projectData && projectData.length > 0) {
        const allData: ExcelRow[] = [];
        projectData.forEach(pd => {
          if (pd.data && pd.data.length > 0) {
            allData.push(...pd.data);
          }
        });
        if (allData.length > 0) {
          setExcelData(allData);
          setProjectStatus('data-ready');
        } else {
          setExcelData([]);
          setProjectStatus('data-ready');
        }
      } else {
        setExcelData([]);
        setProjectStatus('data-ready');
      }
    } catch (err) {
      console.error('Load project data error:', err);
      setExcelData([]);
      setProjectStatus('data-ready');
    }
  };

  const queryTimes = useMemo(() => {
    const times = [...new Set(excelData.map(d => d.query_time))];
    return times.sort();
  }, [excelData]);

  const allQueries = useMemo(() => {
    return [...new Set(excelData.map(d => d.query))];
  }, [excelData]);

  useEffect(() => {
    if (queryTimes.length > 0 && !selectedTime) {
      const sortedTimes = [...queryTimes].sort();
      setSelectedTime(sortedTimes[sortedTimes.length - 1]);
    }
  }, [queryTimes, selectedTime]);

  useEffect(() => {
    if (allQueries.length > 0 && !selectedQuery) {
      setSelectedQuery(allQueries[0]);
    }
  }, [allQueries, selectedQuery]);

  const currentData = useMemo(() => {
    if (!selectedTime || queryTimes.length === 0) return [];
    return excelData.filter(d => d.query_time === selectedTime);
  }, [selectedTime, queryTimes, excelData]);

  const brandStats: BrandStats[] = useMemo(() => {
    const brandMap = new Map<string, BrandStats>();
    
    currentData.forEach(row => {
      const brands = [row.brand1, row.brand2, row.brand3, row.brand4, row.brand5];
      brands.forEach((brand, index) => {
        if (!brandMap.has(brand)) {
          brandMap.set(brand, {
            name: brand,
            totalAppearances: 0,
            position1: 0,
            position2: 0,
            position3: 0,
            position4: 0,
            position5: 0,
            frequency: 0,
            avgPosition: 0,
            exposureRate: 0,
            firstPositionRate: 0,
          });
        }
        const stats = brandMap.get(brand)!;
        stats.totalAppearances++;
        if (index === 0) stats.position1++;
        if (index === 1) stats.position2++;
        if (index === 2) stats.position3++;
        if (index === 3) stats.position4++;
        if (index === 4) stats.position5++;
      });
    });

    const totalQueries = currentData.length;
    const statsArray = Array.from(brandMap.values());
    statsArray.forEach(stats => {
      stats.frequency = (stats.totalAppearances / (totalQueries * 5)) * 100;
      stats.avgPosition = (stats.position1 * 1 + stats.position2 * 2 + stats.position3 * 3 + stats.position4 * 4 + stats.position5 * 5) / stats.totalAppearances;
      stats.exposureRate = (stats.totalAppearances / totalQueries) * 100;
      stats.firstPositionRate = (stats.position1 / totalQueries) * 100;
    });

    return statsArray.sort((a, b) => b.totalAppearances - a.totalAppearances);
  }, [currentData]);

  const currentBrandStats = brandStats.find(b => b.name === projectBrand) || brandStats[0];

  const queryTrends: QueryTrend[] = useMemo(() => {
    const trendMap = new Map<string, Map<string, { exposureCount: number; totalCount: number; positions: number[] }>>();
    
    allQueries.forEach(query => {
      trendMap.set(query, new Map());
    });
    
    queryTimes.forEach(time => {
      const timeData = excelData.filter(d => d.query_time === time);
      
      timeData.forEach(row => {
        const queryTrendMap = trendMap.get(row.query);
        if (!queryTrendMap) return;
        
        let existingData = queryTrendMap.get(time);
        if (!existingData) {
          existingData = { exposureCount: 0, totalCount: 0, positions: [] };
          queryTrendMap.set(time, existingData);
        }
        
        existingData.totalCount++;
        const brands = [row.brand1, row.brand2, row.brand3, row.brand4, row.brand5];
        const position = brands.indexOf(projectBrand);
        
        if (position !== -1) {
          existingData.exposureCount++;
          existingData.positions.push(position + 1);
        }
      });
    });

    const result: QueryTrend[] = [];
    trendMap.forEach((timeMap, query) => {
      const trends: Array<{ time: string; exposureRate: number; position: number }> = [];
      
      queryTimes.forEach(time => {
        const data = timeMap.get(time);
        if (data) {
          const exposureRate = (data.exposureCount / data.totalCount) * 100;
          let avgPosition: number;
          
          if (data.positions.length > 0) {
            avgPosition = data.positions.reduce((a, b) => a + b, 0) / data.positions.length;
          } else {
            avgPosition = 6;
          }
          
          trends.push({
            time,
            exposureRate,
            position: avgPosition,
          });
        }
      });
      
      result.push({ query, trends });
    });
    
    return result;
  }, [queryTimes, allQueries, projectBrand, excelData]);

  const currentQueryTrend = useMemo(() => {
    return queryTrends.find(t => t.query === selectedQuery) || queryTrends[0];
  }, [queryTrends, selectedQuery]);

  const currentGeoSummary = currentData[0]?.geo_summary || '暂无数据';

  const getProjectBrandStats = () => {
    if (!projectBrand || !currentData.length) return null;
    
    let position1 = 0, position2 = 0, position3 = 0, position4 = 0, position5 = 0;
    let totalAppearances = 0;
    
    currentData.forEach(row => {
      const brands = [row.brand1, row.brand2, row.brand3, row.brand4, row.brand5];
      const pos = brands.indexOf(projectBrand);
      if (pos !== -1) {
        totalAppearances++;
        if (pos === 0) position1++;
        if (pos === 1) position2++;
        if (pos === 2) position3++;
        if (pos === 3) position4++;
        if (pos === 4) position5++;
      }
    });
    
    const exposureRate = (totalAppearances / currentData.length) * 100;
    const firstPositionRate = (position1 / currentData.length) * 100;
    const avgPosition = totalAppearances > 0 
      ? (position1 * 1 + position2 * 2 + position3 * 3 + position4 * 4 + position5 * 5) / totalAppearances 
      : 0;
    
    return {
      totalAppearances,
      position1,
      position2,
      position3,
      position4,
      position5,
      exposureRate,
      firstPositionRate,
      avgPosition,
    };
  };

  const projectBrandStats = getProjectBrandStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (projectStatus === 'no-project') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md border border-gray-200">
          <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">暂无项目</h2>
          <p className="text-gray-500 mb-6">您还没有提交项目申请，请先提交项目信息。</p>
          <button onClick={() => navigate('/project/apply')} className="px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600">
            提交项目申请
          </button>
        </div>
      </div>
    );
  }

  if (projectStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md border border-gray-200">
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">监控数据获取中</h2>
          <p className="text-gray-500 mb-2">您的项目已立项成功，数据正在爬取中。</p>
          <p className="text-sm text-gray-400 mb-6">请耐心等待，数据准备完成后将自动展示监控看板</p>
          <button onClick={() => { localStorage.removeItem('currentProjectId'); navigate('/login'); }} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            退出
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">项目 GEO 看板</h1>
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
              {projectName}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">品牌客户</span>
            <button onClick={() => { localStorage.removeItem('currentProjectId'); navigate('/login'); }} className="px-4 py-2 text-gray-600 hover:text-gray-800">退出</button>
          </div>
        </div>
      </header>

      {excelData.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">暂无监控数据</h3>
            <p className="text-gray-500">运营人员正在准备数据，请稍后再来查看</p>
          </div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              当前查询时间数据
            </h2>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white"
            >
              {queryTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              GEO 效果总结
            </h3>
            <p className="text-yellow-700">{currentGeoSummary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {projectBrand} 自身数据
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border border-pink-100">
                <p className="text-gray-500 text-sm">总出现次数</p>
                <p className="text-3xl font-bold text-pink-600">{projectBrandStats?.totalAppearances || 0}</p>
                <p className="text-gray-400 text-xs">查询次数 × 位置</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[projectBrandStats?.position1 || 0, projectBrandStats?.position2 || 0, projectBrandStats?.position3 || 0, projectBrandStats?.position4 || 0, projectBrandStats?.position5 || 0].map((count, idx) => (
                  <div key={idx} className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">位置{idx + 1}</p>
                    <p className="font-bold text-gray-800">{count}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                <p className="text-gray-500 text-sm">曝光率</p>
                <p className="text-3xl font-bold text-blue-600">{projectBrandStats?.exposureRate?.toFixed(1) || 0}%</p>
                <p className="text-gray-400 text-xs">出现次数/总查询次数</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <p className="text-gray-500 text-sm">首位提及率</p>
                <p className="text-3xl font-bold text-green-600">{projectBrandStats?.firstPositionRate?.toFixed(1) || 0}%</p>
                <p className="text-gray-400 text-xs">位置1次数/总查询次数</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              各品牌曝光率统计
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={brandStats.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="exposureRate" name="曝光率%" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-500">品牌</th>
                    <th className="text-right py-2 text-gray-500">出现次数</th>
                    <th className="text-right py-2 text-gray-500">出现频率</th>
                    <th className="text-right py-2 text-gray-500">平均排名</th>
                    <th className="text-right py-2 text-gray-500">首位提及率</th>
                  </tr>
                </thead>
                <tbody>
                  {brandStats.slice(0, 5).map((brand, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2 font-medium text-gray-800">{brand.name}</td>
                      <td className="text-right text-gray-600">{brand.totalAppearances}</td>
                      <td className="text-right text-gray-600">{brand.frequency.toFixed(1)}%</td>
                      <td className="text-right text-gray-600">{brand.avgPosition.toFixed(1)}</td>
                      <td className="text-right text-green-600 font-medium">{brand.firstPositionRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            品牌历史趋势变化
          </h2>
          <div className="mb-4">
            <label className="text-gray-600 text-sm mr-2">选择Query：</label>
            <select
              value={selectedQuery}
              onChange={(e) => setSelectedQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white"
            >
              {allQueries.map(query => (
                <option key={query} value={query}>{query}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">🔹 {projectBrand} 在「{selectedQuery}」曝光率趋势</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={currentQueryTrend?.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis domain={[0, 100]} stroke="#6b7280" />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Line type="monotone" dataKey="exposureRate" stroke="#ec4899" strokeWidth={2} name="曝光率%" dot={{ fill: '#ec4899', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">🔹 {projectBrand} 在「{selectedQuery}」排名趋势</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={currentQueryTrend?.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis domain={[1, 6]} reversed stroke="#6b7280" tickFormatter={(value) => value === 6 ? '未上榜' : `第${value}名`} />
                  <Tooltip formatter={(value: number) => value >= 6 ? '未上榜' : `第${value.toFixed(1)}名`} />
                  <Line type="monotone" dataKey="position" stroke="#3b82f6" strokeWidth={2} name="排名" dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const isNotAppeared = payload.position >= 6;
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={5} 
                        fill={isNotAppeared ? '#EF4444' : '#3b82f6'} 
                        stroke={isNotAppeared ? '#EF4444' : '#3b82f6'} 
                        strokeWidth={2} 
                      />
                    );
                  }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
