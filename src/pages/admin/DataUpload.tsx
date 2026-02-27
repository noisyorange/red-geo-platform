import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface UploadedFile {
  name: string;
  size: string;
  uploadTime: string;
  status: 'success' | 'pending' | 'error';
}

const templateHeaders = ['序号', '查询时间', 'Query：性价比高的智能床推荐', '位置1品牌', '位置2品牌', '位置3', '位置4', '位置5', '品牌问一问输出内容', 'GEO效果总结'];
const templateExample = [
  ['1', '2024-01-15', '性价比高的智能床推荐', '舒达', '丝涟', '金可儿', '慕思', '喜临门', '智能床推荐：舒达、丝涟，金可儿...', '品牌在搜索结果中曝光良好'],
  ['2', '2024-01-15', '智能床品牌排行', '舒达', '丝涟', '金可儿', '慕思', '喜临门', '智能床排行：舒达、丝涟...', '前三位置被知名品牌占据'],
  ['3', '2024-01-20', '性价比高的智能床推荐', '慕思', '舒达', '丝涟', '金可儿', '喜临门', '智能床推荐：慕思、舒达...', '慕思上升至第二'],
];

function downloadTemplate() {
  const csvContent = [
    templateHeaders.join(','),
    ...templateExample.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'GEO数据模板.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function parseCSV(content: string): any[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const fieldMap: Record<string, string> = {
    '查询时间': 'query_time',
    '序号': 'id',
  };
  
  headers.forEach((h, idx) => {
    if (h.includes('Query') || h.startsWith('Query')) {
      fieldMap[h] = 'query';
    } else if (h.includes('位置1') || h === '位置1品牌') {
      fieldMap[h] = 'brand1';
    } else if (h.includes('位置2') || h === '位置2品牌') {
      fieldMap[h] = 'brand2';
    } else if (h.includes('位置3') || h === '位置3') {
      fieldMap[h] = 'brand3';
    } else if (h.includes('位置4') || h === '位置4') {
      fieldMap[h] = 'brand4';
    } else if (h.includes('位置5') || h === '位置5') {
      fieldMap[h] = 'brand5';
    } else if (h.includes('问一问') || h.includes('输出内容')) {
      fieldMap[h] = 'ai_content';
    } else if (h.includes('总结') || h.includes('效果')) {
      fieldMap[h] = 'geo_summary';
    }
  });
  
  const data: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/(".*?"|[^,]+)/g) || [];
    const row: any = {};
    values.forEach((val, idx) => {
      const cleanVal = val.replace(/"/g, '').trim();
      const originalHeader = headers[idx];
      const mappedField = fieldMap[originalHeader];
      if (mappedField) {
        row[mappedField] = cleanVal;
      }
    });
    if (Object.keys(row).length > 0) {
      data.push(row);
    }
  }
  
  return data;
}

export default function DataUpload() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUploadedFiles();
  }, [id]);

  const loadUploadedFiles = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_data')
        .select('*')
        .eq('project_id', parseInt(id))
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const files = data.map(d => ({
          name: d.file_name,
          size: '已上传',
          uploadTime: new Date(d.created_at).toLocaleString('zh-CN'),
          status: 'success' as const,
        }));
        setUploadedFiles(files);
      }
    } catch (err) {
      console.error('Load files error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (!id) return;
    
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const parsedData = parseCSV(content);
        
        const newFile: UploadedFile = {
          name: file.name,
          size: formatFileSize(file.size),
          uploadTime: new Date().toLocaleString('zh-CN'),
          status: 'success',
        };

        setUploadedFiles(prev => [...prev, newFile]);

        try {
          await supabase
            .from('project_data')
            .insert({
              project_id: parseInt(id),
              file_name: file.name,
              data: parsedData,
            });
        } catch (err) {
          console.error('Save data error:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleRemoveFile = async (index: number) => {
    if (!id) return;
    
    const filesToDelete = uploadedFiles[index];
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));

    try {
      await supabase
        .from('project_data')
        .delete()
        .eq('project_id', parseInt(id))
        .eq('file_name', filesToDelete.name);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/project/${id}`)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">数据上传</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">运营人员</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">项目已立项</h2>
                <p className="text-sm text-gray-500">请上传该项目的Query统计结果数据</p>
              </div>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载模板
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">上传统计结果</h2>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
            <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              点击或拖拽文件到此处上传
            </p>
            <p className="text-gray-500 text-sm">
              支持 .xlsx, .xls, .csv 格式，单次最多上传 10 个文件
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : uploadedFiles.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">已上传文件</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.size} · {file.uploadTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        上传成功
                      </span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📋 数据格式说明</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 第一行必须为表头，包含：序号, 查询时间, Query, 位置1品牌, 位置2品牌, 位置3, 位置4, 位置5, 品牌问一问输出内容, GEO效果总结</li>
              <li>• Query 列支持关键词和短语</li>
              <li>• 位置1-5 填写品牌名称</li>
              <li>• 建议点击上方"下载模板"按钮获取标准格式示例</li>
            </ul>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => navigate(`/admin/project/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              返回
            </button>
            <button
              onClick={() => navigate('/admin/upload')}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
