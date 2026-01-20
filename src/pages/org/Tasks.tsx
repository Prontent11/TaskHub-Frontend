import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AppLayout from '../../layout/AppLayout';
import Sidebar from '../../components/Sidebar';
import { getTasks, createTask, updateTaskStatus, updateTaskDetails, getOrgUsers } from '../../api/org.api';
import { getCurrentUser } from '../../auth/auth';
interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate: string;
  assignedToId?: number;
  createdById?: number;
  createdBy?: { email: string };
  assignedTo?: { email: string };
}

interface User {
  id: number;
  email: string;
  role: string;
}

interface EditingTask {
  id: number;
  title: string;
  description?: string;
  priority: string;
  dueDate: string;
  assignedToId?: number;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [dueDate, setDueDate] = useState('');
  const [assignedToId, setAssignedToId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate');
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const user = getCurrentUser();
  async function load() {
    try {
      setError('');
      const [tasksRes, usersRes] = await Promise.all([
        getTasks(),
        getOrgUsers(),
      ]);
      setTasks(tasksRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    }
  }

  async function submit() {
    if (!title.trim() || !dueDate) {
      setError('Title and due date are required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await createTask(title, description, priority, dueDate, assignedToId);
      setTitle('');
      setDescription('');
      setPriority('LOW');
      setDueDate('');
      setAssignedToId(null);
      setSuccess('Task created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: number, newStatus: string) {
    try {
      setError('');
      await updateTaskStatus(id, newStatus);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  }

  async function openEditModal(task: Task) {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedToId: task.assignedToId,
    });
  }

  async function saveEditTask() {
    if (!editingTask) return;
    if (!editingTask.title.trim() || !editingTask.dueDate) {
      setError('Title and due date are required');
      return;
    }

    try {
      setEditLoading(true);
      setError('');
      await updateTaskDetails(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
        assignedToId: editingTask.assignedToId,
      });
      setSuccess('Task updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setEditingTask(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setEditLoading(false);
    }
  }

  function cancelEdit() {
    setEditingTask(null);
  }

  const canChangeStatus = (task: Task, newStatus: string) => {
    // Admin and Manager can always change status
    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      return true;
    }

    // USER can only change status of assigned tasks
    if (user.role === 'USER') {
      // User can only change status if assigned to this task
      if (task.assignedToId !== user.id) {
        return false;
      }
      // User can only mark as COMPLETED (not REOPENED or other statuses)
      return newStatus === 'COMPLETED' || newStatus === 'IN_PROGRESS';
    }

    return false;
  };

  const canReopen = (task: Task) => {
    // Only the creator can reopen
    return task.createdById === user.id;
  };

  const filteredTasks = tasks.filter(t => filterStatus === 'ALL' || t.status === filterStatus);
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'priority') {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
    }
    return 0;
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'OPEN': return 'bg-purple-100 text-purple-800';
      case 'REOPENED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = (task: Task) => {
    const currentStatus = task.status;
    const allStatuses = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'REOPENED'];
    
    // Filter out current status
    let availableStatuses = allStatuses.filter(s => s !== currentStatus);
    
    // Filter based on user permissions
    if (user.role === 'USER') {
      // Users can only mark as COMPLETED or IN_PROGRESS
      availableStatuses = availableStatuses.filter(s => s === 'COMPLETED' || s === 'IN_PROGRESS');
    } else if (user.role === 'MANAGER' || user.role === 'ADMIN') {
      // Managers/Admins cannot reopen - only creator can
      if (!canReopen(task)) {
        availableStatuses = availableStatuses.filter(s => s !== 'REOPENED');
      }
    }
    
    return availableStatuses;
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AppLayout sidebar={<Sidebar />}>
      <>
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Task Section */}
          {user.role=="USER"?<></>:<Card className="lg:col-span-1 sticky top-24 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create Task</h3>
            <Input
              label="Title"
              placeholder="Task title"
              value={title}
              onChange={(e:any)=>setTitle(e.target.value)}
            />
            <Input
              label="Description"
              placeholder="Task description (optional)"
              value={description}
              onChange={(e:any)=>setDescription(e.target.value)}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select 
                className="form-select"
                value={priority}
                onChange={e=>setPriority(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e:any)=>setDueDate(e.target.value)}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
              <select 
                className="form-select"
                value={assignedToId || ''}
                onChange={e=>setAssignedToId(Number(e.target.value) || null)}
              >
                <option value="">👤 Unassigned</option>
                {users && users.map(u => (
                  <option key={u.id} value={u.id}>{u.email}</option>
                ))}
              </select>
            </div>

            <Button onClick={submit} disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </Card>
}
          {/* Tasks List */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-gray-900">📋 Tasks ({sortedTasks.length})</h3>
              <div className="flex gap-2 flex-wrap">
                <select 
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="ALL">All Status</option>
                  <option value="OPEN">🔵 Open</option>
                  <option value="IN_PROGRESS">🔄 In Progress</option>
                  <option value="COMPLETED">✅ Completed</option>
                  <option value="REOPENED">🔁 Reopened</option>
                </select>
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>
            </div>

            {sortedTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">🎉 No tasks {filterStatus !== 'ALL' ? `with status "${filterStatus}"` : 'yet'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTasks.map(t => (
                  <div key={t.id} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{t.title}</h4>
                        {t.description && <p className="text-sm text-gray-600 mt-1">{t.description}</p>}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex gap-2 flex-wrap items-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(t.priority)}`}>
                          {getPriorityIcon(t.priority)} {t.priority}
                        </span>
                        {t.dueDate && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            📅 {new Date(t.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {t.assignedTo && (
                          <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                            👤 {t.assignedTo.email}
                          </span>
                        )}
                      </div>
                      <div>
                        {canChangeStatus(t, 'COMPLETED') && t.status !== 'COMPLETED' && (
                          <select
                            value={t.status}
                            onChange={(e) => changeStatus(t.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white hover:bg-gray-50"
                            disabled={getStatusOptions(t).length === 0}
                          >
                            <option value={t.status}>Change Status</option>
                            {getStatusOptions(t).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        )}
                        {t.status === 'COMPLETED' && canReopen(t) && (
                          <button
                            onClick={() => changeStatus(t.id, 'REOPENED')}
                            className="text-xs px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                          >
                            🔁 Reopen
                          </button>
                        )}
                      </div>
                      {user.role !== "USER" && (
                        <Button 
                          onClick={() => openEditModal(t)} 
                          className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          ✏️ Edit
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Task</h3>
            
            <Input
              label="Title"
              placeholder="Task title"
              value={editingTask.title}
              onChange={(e: any) => setEditingTask({...editingTask, title: e.target.value})}
            />
            <Input
              label="Description"
              placeholder="Task description (optional)"
              value={editingTask.description || ''}
              onChange={(e: any) => setEditingTask({...editingTask, description: e.target.value})}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select 
                className="form-select w-full"
                value={editingTask.priority}
                onChange={e => setEditingTask({...editingTask, priority: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <Input
              label="Due Date"
              type="date"
              value={editingTask.dueDate}
              onChange={(e: any) => setEditingTask({...editingTask, dueDate: e.target.value})}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
              <select 
                className="form-select w-full"
                value={editingTask.assignedToId || ''}
                onChange={e => setEditingTask({...editingTask, assignedToId: Number(e.target.value) || undefined})}
              >
                <option value="">👤 Unassigned</option>
                {users && users.map(u => (
                  <option key={u.id} value={u.id}>{u.email}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={saveEditTask} 
                disabled={editLoading}
                className="flex-1"
              >
                {editLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                onClick={cancelEdit}
                className="flex-1 bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
    </AppLayout>
  );
}
