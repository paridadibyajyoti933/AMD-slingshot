import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import theme from '../styles/theme';
import { plannerAPI } from '../services/api';

const WeeklyPlanner = () => {
    const [tasks, setTasks] = useState([]);
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

    const handleUpdateTask = async (taskId, updates) => {
        try {
            await plannerAPI.updateTask(taskId, updates);
            await loadTasks();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: theme.colors.background,
            fontFamily: theme.typography.fontFamily,
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: theme.spacing.xxl }}>
                {/* Header */}
                <div style={{ marginBottom: theme.spacing.xxxl }}>
                    <Link to="/dashboard" style={{
                        color: theme.colors.textSecondary,
                        textDecoration: 'none',
                        fontSize: theme.typography.small,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'inline-block',
                        marginBottom: theme.spacing.md
                    }}>
                        ← Dashboard
                    </Link>
                    <h1 style={{
                        fontSize: theme.typography.hero,
                        fontWeight: theme.typography.black,
                        lineHeight: '1',
                        marginBottom: theme.spacing.md,
                        letterSpacing: '-0.02em'
                    }}>
                        PLANNER
                    </h1>
                    <p style={{
                        fontSize: theme.typography.h5,
                        color: theme.colors.textSecondary,
                        maxWidth: '600px'
                    }}>
                        Organize your week with AI-powered task management.
                    </p>
                </div>

                {/* New Task Button */}
                <button
                    onClick={() => setShowNewTask(!showNewTask)}
                    style={{
                        padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                        background: showNewTask ? theme.colors.textPrimary : theme.colors.accent,
                        color: theme.colors.surface,
                        border: 'none',
                        fontSize: theme.typography.body,
                        fontWeight: theme.typography.bold,
                        cursor: 'pointer',
                        marginBottom: theme.spacing.xl,
                        fontFamily: theme.typography.fontFamily
                    }}
                >
                    {showNewTask ? 'Cancel' : '+ New Task'}
                </button>

                {/* New Task Form */}
                {showNewTask && (
                    <form onSubmit={handleCreateTask} style={{
                        background: theme.colors.surface,
                        border: `2px solid ${theme.colors.textPrimary}`,
                        padding: theme.spacing.xl,
                        marginBottom: theme.spacing.xxxl
                    }}>
                        <h2 style={{
                            fontSize: theme.typography.h3,
                            fontWeight: theme.typography.bold,
                            marginBottom: theme.spacing.lg
                        }}>
                            Create Task
                        </h2>

                        <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="Task title"
                            required
                            style={{
                                width: '100%',
                                padding: theme.spacing.md,
                                border: `1px solid ${theme.colors.border}`,
                                fontSize: theme.typography.body,
                                marginBottom: theme.spacing.md,
                                fontFamily: theme.typography.fontFamily,
                                outline: 'none'
                            }}
                        />

                        <textarea
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            placeholder="Description"
                            rows="4"
                            style={{
                                width: '100%',
                                padding: theme.spacing.md,
                                border: `1px solid ${theme.colors.border}`,
                                fontSize: theme.typography.body,
                                marginBottom: theme.spacing.md,
                                fontFamily: theme.typography.fontFamily,
                                outline: 'none',
                                resize: 'vertical'
                            }}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
                            <div>
                                <label style={{ fontSize: theme.typography.small, color: theme.colors.textSecondary, display: 'block', marginBottom: theme.spacing.xs }}>
                                    Deadline
                                </label>
                                <input
                                    type="datetime-local"
                                    value={newTask.deadline}
                                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: theme.spacing.sm,
                                        border: `1px solid ${theme.colors.border}`,
                                        fontSize: theme.typography.body,
                                        fontFamily: theme.typography.fontFamily
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: theme.typography.small, color: theme.colors.textSecondary, display: 'block', marginBottom: theme.spacing.xs }}>
                                    Hours
                                </label>
                                <input
                                    type="number"
                                    value={newTask.estimated_hours}
                                    onChange={(e) => setNewTask({ ...newTask, estimated_hours: parseInt(e.target.value) })}
                                    min="1"
                                    style={{
                                        width: '100%',
                                        padding: theme.spacing.sm,
                                        border: `1px solid ${theme.colors.border}`,
                                        fontSize: theme.typography.body,
                                        fontFamily: theme.typography.fontFamily
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: theme.typography.small, color: theme.colors.textSecondary, display: 'block', marginBottom: theme.spacing.xs }}>
                                    Priority
                                </label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: theme.spacing.sm,
                                        border: `1px solid ${theme.colors.border}`,
                                        fontSize: theme.typography.body,
                                        fontFamily: theme.typography.fontFamily
                                    }}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                                background: theme.colors.accent,
                                color: theme.colors.surface,
                                border: 'none',
                                fontSize: theme.typography.body,
                                fontWeight: theme.typography.bold,
                                cursor: 'pointer',
                                fontFamily: theme.typography.fontFamily
                            }}
                        >
                            Create Task
                        </button>
                    </form>
                )}

                {/* Tasks List */}
                <div>
                    <h2 style={{
                        fontSize: theme.typography.h3,
                        fontWeight: theme.typography.black,
                        marginBottom: theme.spacing.lg
                    }}>
                        Tasks ({tasks.length})
                    </h2>

                    {tasks.length === 0 ? (
                        <div style={{
                            background: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`,
                            padding: theme.spacing.xxl,
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: theme.typography.h5,
                                color: theme.colors.textSecondary
                            }}>
                                No tasks yet
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: theme.spacing.sm }}>
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    style={{
                                        background: theme.colors.surface,
                                        border: `1px solid ${theme.colors.border}`,
                                        padding: theme.spacing.lg,
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: theme.spacing.sm }}>
                                        <h3 style={{
                                            fontSize: theme.typography.h5,
                                            fontWeight: theme.typography.bold,
                                            flex: 1
                                        }}>
                                            {task.title}
                                        </h3>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
                                            style={{
                                                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                                border: `1px solid ${theme.colors.border}`,
                                                fontSize: theme.typography.small,
                                                fontFamily: theme.typography.fontFamily,
                                                textTransform: 'uppercase',
                                                fontWeight: theme.typography.bold
                                            }}
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    {task.description && (
                                        <p style={{
                                            fontSize: theme.typography.body,
                                            color: theme.colors.textSecondary,
                                            marginBottom: theme.spacing.sm
                                        }}>
                                            {task.description}
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', gap: theme.spacing.md, fontSize: theme.typography.small, color: theme.colors.textSecondary }}>
                                        {task.deadline && (
                                            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                        )}
                                        <span>{task.estimated_hours}h</span>
                                        <span style={{ textTransform: 'uppercase' }}>{task.priority}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeeklyPlanner;
