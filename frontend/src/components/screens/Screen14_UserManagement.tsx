import React, { useState } from 'react';
import { User } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Users as UsersIcon,
  Shield,
  Plus,
  Lock,
  Mail,
  CheckCircle2,
  Key,
  Clock,
  UserCheck
} from 'lucide-react';

interface Screen14Props {
  users: User[];
  onAddUser: (userData: any) => void;
}

export const Screen14_UserManagement: React.FC<Screen14Props> = ({ users, onAddUser }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Fleet Analyst');
  const [department, setDepartment] = useState('Analytics');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onAddUser({ name, email, role, department });
    setName('');
    setEmail('');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Add User */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>User Management & RBAC</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Access Control
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage operational roles, module-level permissions, authentication policies and audit logs for fleet analysts and engineers.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Top Stats Cards matching Frame 14 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400">Total Users</div>
          <div className="text-2xl font-bold text-white font-mono">{users.length}</div>
          <div className="text-[10px] text-emerald-400">+20% vs last month</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400">Active Operators</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{users.filter((u) => u.status === 'Active').length}</div>
          <div className="text-[10px] text-slate-400">All sessions verified</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400">Pending Invitations</div>
          <div className="text-2xl font-bold text-amber-400 font-mono">2</div>
          <div className="text-[10px] text-slate-400">Invited via SSO</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400">Inactive Accounts</div>
          <div className="text-2xl font-bold text-slate-400 font-mono">0</div>
          <div className="text-[10px] text-emerald-400">Zero orphaned accounts</div>
        </div>
      </div>

      {/* Main Grid: Left Users Table (3/5), Right Permissions & Security (2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Users Directory Table */}
        <div className="lg:col-span-3 glass-panel rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-cyan-400" />
              <span>User Directory</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">{users.length} Operators</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-7 w-7 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-medium text-[10px] border border-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{u.department}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={u.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">{u.last_login}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Module Permissions Matrix & Security Policies */}
        <div className="lg:col-span-2 space-y-4">
          {/* Permissions Matrix */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Role Permissions Matrix</span>
              </h2>
              <span className="text-[10px] text-emerald-400 font-mono">Role: Fleet Analyst</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span>View Fleet Overview & Map</span>
                <span className="text-emerald-400 font-bold">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span>View Vessel Telemetry & Engine Sensors</span>
                <span className="text-emerald-400 font-bold">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span>Run QIEA Multi-Objective Optimization</span>
                <span className="text-emerald-400 font-bold">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span>Simulate What-If Scenarios</span>
                <span className="text-emerald-400 font-bold">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span>Modify Fleet Configuration & System Settings</span>
                <span className="text-slate-500 font-medium">Admin Only</span>
              </div>
            </div>
          </div>

          {/* Security & Password Policies matching Frame 14 */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Key className="h-4 w-4 text-purple-400" />
                <span>Password & Security Policies</span>
              </h2>
              <span className="text-[10px] text-purple-300 font-mono">Enforced</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Minimum Password Length:</span>
                <span className="font-mono text-white font-bold">12 characters</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Require 2FA Authentication:</span>
                <span className="text-emerald-400 font-bold">Enforced (TOTP)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Block After Failed Attempts:</span>
                <span className="font-mono text-white">5 Attempts</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Session Expiration:</span>
                <span className="font-mono text-white">8 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel-glow rounded-2xl w-full max-w-md p-6 space-y-4 border border-cyan-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-cyan-400" />
                <span>Add / Invite New User</span>
              </h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Captain James Kirk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@maritime.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Assign Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Fleet Analyst">Fleet Analyst</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Maintenance Engineer">Maintenance Engineer</option>
                    <option value="Compliance Officer">Compliance Officer</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
