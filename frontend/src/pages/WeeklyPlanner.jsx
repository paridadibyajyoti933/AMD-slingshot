import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Zap, AlertTriangle } from 'lucide-react';
import { plannerAPI } from '../services/api';
import TaskCard from '../components/TaskCard';

const WeeklyPlanner = () => {
    const [tasks, setTasks] = useState([]);
    const [schedule, setSchedule] = useState(null);
    const [showNewTask, setShowNewTask] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        deadline: '',
        estimated_hours: 1,
        priority: 'medium'
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await plannerAPI.listTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await plannerAPI.createTask({
                ...newTask,
                deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : null
            });
            setNewTask({ title: '', description: '', deadline: '', estimated_hours: 1, priority: 'medium' });
            setShowNewTask(false);
            await loadTasks();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleOptimizeSchedule = async () => {
        try {
            const result = await plannerAPI.optimizeSchedule();
            setSchedule(result);
        } catch (error) {
            console.error('Failed to optimize schedule:', error);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Weekly Planner</h1>
                    <p className="text-dark-400">AI-optimized task scheduling</p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={handleOptimizeSchedule} className="btn-secondary flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Optimize Schedule</span>
                    </button>
                    <button onClick={() => setShowNewTask(true)} className="btn-primary flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>New Task</span>
                    </button>
                </div>
            </div>

            {/* New Task Modal */}
            {showNewTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="card max-w-lg w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="input-field"
                                    rows="3"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Deadline</label>
                                    <input
                                        type="datetime-local"
                                        value={newTask.deadline}
                                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Estimated Hours</label>
                                    <input
                                        type="number"
                                        value={newTask.estimated_hours}
                                        onChange={(e) => setNewTask({ ...newTask, estimated_hours: parseFloat(e.target.value) })}
                                        className="input-field"
                                        min="0.5"
                                        step="0.5"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Priority</label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div className="flex space-x-3">
                                <button type="submit" className="btn-primary flex-1">Create Task</button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewTask(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Optimized Schedule */}
            {schedule && (
                <div className="mb-8 card bg-gradient-to-br from-primary-600/20 to-purple-600/20 border-primary-600/30">
                    <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-primary-400" />
                        <span>Optimized Schedule</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-dark-800/50 rounded-lg p-4">
                            <p className="text-dark-400 text-sm">Total Tasks</p>
                            <p className="text-2xl font-bold">{schedule.total_tasks}</p>
                        </div>
                        <div className="bg-dark-800/50 rounded-lg p-4">
                            <p className="text-dark-400 text-sm">Scheduled</p>
                            <p className="text-2xl font-bold text-green-400">{schedule.scheduled_tasks}</p>
                        </div>
                        <div className="bg-dark-800/50 rounded-lg p-4">
                            <p className="text-dark-400 text-sm">At Risk</p>
                            <p className="text-2xl font-bold text-red-400">{schedule.deadline_risks?.length || 0}</p>
                        </div>
                    </div>

                    {schedule.deep_work_suggestions?.length > 0 && (
                        <div>
                            <h3 className="font-bold mb-3">Suggested Deep Work Blocks</h3>
                            <div className="space-y-2">
                                {schedule.deep_work_suggestions.slice(0, 5).map((block, idx) => (
                                    <div key={idx} className="bg-dark-800/50 rounded-lg p-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{block.title}</p>
                                            <p className="text-sm text-dark-400">
                                                {new Date(block.start_time).toLocaleString()} - {new Date(block.end_time).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${block.energy_level === 'high' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                                            }`}>
                                            {block.energy_level} energy
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tasks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="card text-center py-20">
                    <CalendarIcon className="w-16 h-16 mx-auto text-dark-600 mb-4" />
                    <p className="text-dark-400 mb-4">No tasks yet. Create your first task to get started!</p>
                    <button onClick={() => setShowNewTask(true)} className="btn-primary">
                        <Plus className="w-4 h-4 inline mr-2" />
                        Create Task
                    </button>
                </div>
            )}
        </div>
    );
};

export default WeeklyPlanner;
