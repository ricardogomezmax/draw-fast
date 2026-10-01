'use client'

import { useState, useEffect } from 'react'

export default function AdminPage() {
	const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'ai' | 'logs'>('overview')
	const [modelId, setModelId] = useState('110602490-lcm-sd15-i2i')
	const [inferenceSteps, setInferenceSteps] = useState('4')
	const [defaultPrompt, setDefaultPrompt] = useState('High quality, detailed, masterpiece')
	const [syncSpeed, setSyncSpeed] = useState('fast')
	const [maxCanvasSize, setMaxCanvasSize] = useState('2048')
	const [proxyStatus, setProxyStatus] = useState('Operacional')
	const [saved, setSaved] = useState(false)

	useEffect(() => {
		const savedSettings = localStorage.getItem('draw_fast_admin_settings')
		if (savedSettings) {
			try {
				const parsed = JSON.parse(savedSettings)
				if (parsed.modelId) setModelId(parsed.modelId)
				if (parsed.inferenceSteps) setInferenceSteps(parsed.inferenceSteps)
				if (parsed.defaultPrompt) setDefaultPrompt(parsed.defaultPrompt)
				if (parsed.syncSpeed) setSyncSpeed(parsed.syncSpeed)
				if (parsed.maxCanvasSize) setMaxCanvasSize(parsed.maxCanvasSize)
				if (parsed.proxyStatus) setProxyStatus(parsed.proxyStatus)
			} catch (e) {
				console.error(e)
			}
		}
	}, [])

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault()
		const settings = {
			modelId,
			inferenceSteps,
			defaultPrompt,
			syncSpeed,
			maxCanvasSize,
			proxyStatus,
		}
		localStorage.setItem('draw_fast_admin_settings', JSON.stringify(settings))
		setSaved(true)
		setTimeout(() => setSaved(false), 3000)
	}

	return (
		<div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col">
			<header className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
				<div className="flex items-center gap-3">
					<h1 className="text-xl font-bold tracking-tight">Draw Fast • Painel Admin Completo</h1>
					<span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20">
						{proxyStatus}
					</span>
				</div>
				<div className="flex items-center gap-4">
					<a href="/" className="text-sm text-neutral-400 hover:text-white underline">
						Voltar ao Editor
					</a>
				</div>
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
						Configurações de IA
					</button>
					<button
						onClick={() => setActiveTab('ai')}
						className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
							activeTab === 'ai'
								? 'bg-neutral-800 text-white'
								: 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
						}`}
					>
						Parâmetros & Prompts
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
				<main className="flex-1 p-8 max-w-4xl">
					{activeTab === 'overview' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<h2 className="text-2xl font-semibold">Visão Geral do Sistema</h2>
								<span className="text-xs text-neutral-400">Atualização em tempo real</span>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-lg">
									<p className="text-sm text-neutral-400">Status do Proxy</p>
									<p className="text-2xl font-bold text-emerald-400 mt-1">{proxyStatus}</p>
								</div>
								<div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-lg">
									<p className="text-sm text-neutral-400">Modelo Atual</p>
									<p className="text-sm font-mono font-medium text-white mt-1 truncate" title={modelId}>{modelId}</p>
								</div>
								<div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-lg">
									<p className="text-sm text-neutral-400">Sessões Ativas</p>
									<p className="text-2xl font-bold text-blue-400 mt-1">1 Conectada</p>
								</div>
							</div>
							<div className="bg-neutral-800/30 border border-neutral-800 p-6 rounded-lg space-y-4">
								<h3 className="text-lg font-medium">Ações Rápidas do Administrador</h3>
								<div className="flex flex-wrap gap-3">
									<button
										onClick={() => {
										localStorage.clear()
										alert('Cache limpo com sucesso!')
									}}
									className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium px-4 py-2 rounded transition-colors"
								>
									Limpar Cache Local
									</button>
									<button
										onClick={() => {
										setProxyStatus(proxyStatus === 'Operacional' ? 'Manutenção' : 'Operacional')
									}}
									className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium px-4 py-2 rounded transition-colors"
								>
									Alternar Status do Proxy
									</button>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'settings' && (
						<div className="space-y-6 max-w-xl">
							<h2 className="text-2xl font-semibold">Configurações de IA e Proxy</h2>
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
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-1">
										Status do Proxy
									</label>
									<select
										value={proxyStatus}
										onChange={(e) => setProxyStatus(e.target.value)}
										className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
									>
										<option value="Operacional">Operacional</option>
										<option value="Manutenção">Manutenção</option>
										<option value="Sob Carga">Sob Carga</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-1">
										Tamanho Máximo do Canvas (px)
									</label>
									<input
										type="number"
										value={maxCanvasSize}
										onChange={(e) => setMaxCanvasSize(e.target.value)}
										className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
									/>
								</div>
								<div className="pt-2 flex items-center">
									<button
										type="submit"
										className="bg-white text-neutral-900 font-medium px-4 py-2 rounded hover:bg-neutral-200 transition-colors"
									>
										Salvar Alterações
									</button>
									{saved && <span className="ml-3 text-emerald-400 text-sm">Salvo com sucesso!</span>}
								</div>
							</form>
						</div>
					)}

					{activeTab === 'ai' && (
						<div className="space-y-6 max-w-xl">
							<h2 className="text-2xl font-semibold">Parâmetros de Geração e Prompts</h2>
							<form onSubmit={handleSave} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-1">
										Passos de Inferência (Steps)
									</label>
									<input
										type="number"
										value={inferenceSteps}
										onChange={(e) => setInferenceSteps(e.target.value)}
										className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-1">
										Prompt Padrão (Global)
									</label>
									<textarea
										value={defaultPrompt}
										onChange={(e) => setDefaultPrompt(e.target.value)}
										rows={3}
										className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-1">
										Velocidade de Sincronização
									</label>
									<select
										value={syncSpeed}
										onChange={(e) => setSyncSpeed(e.target.value)}
										className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
									>
										<option value="fast">Ultra Rápido (LCM)</option>
										<option value="balanced">Balanceado</option>
										<option value="quality">Máxima Qualidade</option>
									</select>
								</div>
								<div className="pt-2 flex items-center">
									<button
										type="submit"
										className="bg-white text-neutral-900 font-medium px-4 py-2 rounded hover:bg-neutral-200 transition-colors"
									>
										Salvar Parâmetros
									</button>
									{saved && <span className="ml-3 text-emerald-400 text-sm">Salvo com sucesso!</span>}
								</div>
							</form>
						</div>
					)}

					{activeTab === 'logs' && (
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold">Logs do Sistema e Atividade</h2>
							<div className="bg-black border border-neutral-800 rounded-lg p-4 font-mono text-xs text-neutral-300 space-y-2">
								<p className="text-neutral-500">[INFO] Sistema iniciado com sucesso.</p>
								<p className="text-emerald-400">[PROXY] Conexão estabelecida com fal.ai.</p>
								<p className="text-blue-400">[CONFIG] Configurações de modelo atualizadas via painel admin.</p>
								<p className="text-neutral-400">[INFO] Pronto para receber requisições de live painting.</p>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
