'use client'

import { useState } from 'react'

export default function AdminPage() {
	const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'logs'>('overview')
	const [modelId, setModelId] = useState('110602490-lcm-sd15-i2i')
	const [saved, setSaved] = useState(false)

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault()
		setSaved(true)
		setTimeout(() => setSaved(false), 3000)
	}

	return (
		<div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col">
			<header className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
				<h1 className="text-xl font-bold tracking-tight">Draw Fast • Painel Admin</h1>
				<a href="/" className="text-sm text-neutral-400 hover:text-white underline">
					Voltar ao Editor
				</a>
			</header>
			<div className="flex flex-1">
				<aside className="w-64 border-r border-neutral-800 p-4 space-y-2">
					<button
						onClick={() => setActiveTab('overview')}
						className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
							activeTab === 'overview'
								? 'bg-neutral-800 text-white'
								: 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
						}`}
					>
						Visão Geral
					</button>
					<button
						onClick={() => setActiveTab('settings')}
						className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
							activeTab === 'settings'
								? 'bg-neutral-800 text-white'
								: 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
						}`}
					>
						Configurações
					</button>
					<button
						onClick={() => setActiveTab('logs')}
						className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
							activeTab === 'logs'
								? 'bg-neutral-800 text-white'
								: 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
						}`}
					>
						Logs e Atividade
					</button>
				</aside>
				<main className="flex-1 p-8">
					{activeTab === 'overview' && (
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold">Visão Geral do Sistema</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-lg">
									<p className="text-sm text-neutral-400">Status do Proxy</p>
									<p className="text-2xl font-bold text-emerald-400 mt-1">Operacional</p>
								</div>
								<div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-lg">
									<p className="text-sm text-neutral-400">Modelo Atual</p>
									<p className="text-lg font-mono font-medium text-white mt-1 truncate">{modelId}</p>
								</div>
								<div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-lg">
									<p className="text-sm text-neutral-400">Sessões Ativas</p>
									<p className="text-2xl font-bold text-blue-400 mt-1">1</p>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'settings' && (
						<div className="space-y-6 max-w-xl">
							<h2 className="text-2xl font-semibold">Configurações de IA</h2>
							<form onSubmit={handleSave} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-1">
										App ID / Modelo Fal.ai
									</label>
									<input
										type="text"
										value={modelId}
										onChange={(e) => setModelId(e.target.value)}
										className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
									/>
								</div>
								<button
									type="submit"
									className="bg-white text-neutral-900 font-medium px-4 py-2 rounded hover:bg-neutral-200 transition-colors"
								>
									Salvar Alterações
								</button>
								{saved && <span className="ml-3 text-emerald-400 text-sm">Salvo com sucesso!</span>}
							</form>
						</div>
					)}

					{activeTab === 'logs' && (
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold">Logs do Sistema</h2>
							<div className="bg-black border border-neutral-800 rounded-lg p-4 font-mono text-xs text-neutral-300 space-y-2">
								<p className="text-neutral-500">[INFO] Sistema iniciado com sucesso.</p>
								<p className="text-emerald-400">[PROXY] Conexão estabelecida com fal.ai.</p>
								<p className="text-neutral-400">[INFO] Pronto para receber requisições de live painting.</p>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
