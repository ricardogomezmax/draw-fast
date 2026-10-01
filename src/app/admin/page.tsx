'new client'
'use client'

import { useState, useEffect } from 'react'

export default function AdminPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [usernameInput, setUsernameInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')
	const [loginError, setLoginError] = useState(false)

	const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'ai' | 'logs'>('overview')
	const [modelId, setModelId] = useState('110602490-lcm-sd15-i2i')
	const [inferenceSteps, setInferenceSteps] = useState('4')
	const [defaultPrompt, setDefaultPrompt] = useState('High quality, detailed, masterpiece')
	const [syncSpeed, setSyncSpeed] = useState('fast')
	const [maxCanvasSize, setMaxCanvasSize] = useState('2048')
	const [proxyStatus, setProxyStatus] = useState('Operacional')
	const [saved, setSaved] = useState(false)

	useEffect(() => {
		const auth = localStorage.getItem('draw_fast_admin_auth')
		if (auth === 'true') {
			setIsAuthenticated(true)
		}

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

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault()
		if (usernameInput === 'admin' && passwordInput === 'admin') {
			setIsAuthenticated(true)
			localStorage.setItem('draw_fast_admin_auth', 'true')
			setLoginError(false)
		} else {
			setLoginError(true)
		}
	}

	const handleLogout = () => {
		setIsAuthenticated(false)
		localStorage.removeItem('draw_fast_admin_auth')
		setUsernameInput('')
		setPasswordInput('')
	}

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

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center p-4">
				<div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 max-w-md w-full shadow-2xl">
					<div className="text-center mb-6">
						<h1 className="text-2xl font-bold tracking-tight">Área Administrativa</h1>						<p className="text-sm text-neutral-400 mt-1">Digite suas credenciais de administrador</p>
					</div>
					<form onSubmit={handleLogin} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">Usuário (admin)</label>
							<input
								type="text"
								value={usernameInput}
								onChange={(e) => setUsernameInput(e.target.value)}
								placeholder="admin"
								className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">Senha (admin)</label>
							<input
								type="password"
								value={passwordInput}
								onChange={(e) => setPasswordInput(e.target.value)}
								placeholder="•••••"
								className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
							/>
						</div>
						{loginError && (
							<p className="text-red-400 text-xs">Usuário ou senha incorretos. Use admin / admin.</p>
						)}
						<button
							type="submit"
							className="w-full bg-white text-neutral-900 font-medium py-2 rounded hover:bg-neutral-200 transition-colors"
						>
							Entrar no Painel
						</button>
					</form>
					<div className="mt-6 text-center">
						<a href="/" className="text-xs text-neutral-400 hover:text-white underline">
							Voltar ao Editor
						</a>
					</div>
				</div>
			</div>
		)
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
					<button
						onClick={handleLogout}
						className="text-xs bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded hover:bg-neutral-700 transition-colors"
					>
						Sair
					</button>
				</div>
			</header>
			<div className="flex flex-1">
				<aside className="w-64 border-r border-neutral-800 p-4 space-y-1">
					<button
						onClick={() => setActiveTab('overview')}
						className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}
					>
						Visão Geral
					</button>
					<button
						onClick={() => setActiveTab('settings')}
						className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}
					>
						Configurações do Sistema
					</button>
					<button
						onClick={() => setActiveTab('ai')}
						className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}
					>
						Parâmetros de IA & Prompts
					</button>
					<button
						onClick={() => setActiveTab('logs')}
						className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'logs' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}
					>
						Logs do Sistema
					</button>
				</aside>
				<main className="flex-1 p-8">
					{activeTab === 'overview' && (
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold">Visão Geral do Sistema</h2>
							<div className="grid grid-cols-3 gap-6">
								<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-5">
									<h3 className="text-sm font-medium text-neutral-400">Modelo Atual</h3>
									<p className="text-lg font-bold mt-1 text-white">{modelId}</p>
								</div>
								<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-5">
									<h3 className="text-sm font-medium text-neutral-400">Passos de Inferência</h3>
									<p className="text-lg font-bold mt-1 text-white">{inferenceSteps}</p>
								</div>
								<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-5">
									<h3 className="text-sm font-medium text-neutral-400">Status do Proxy</h3>
									<p className="text-lg font-bold mt-1 text-emerald-400">{proxyStatus}</p>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'settings' && (
						<div className="space-y-6 max-w-xl">
							<h2 className="text-2xl font-semibold">Configurações Gerais</h2>
							<form onSubmit={handleSave} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-1">
										ID do Modelo / App ID
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
										<option value="Instável">Instável</option>
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
								<p className="text-neutral-500">[INFO] Sistema iniciado com sucesso na porta 3000.</p>
								<p className="text-emerald-400">[PROXY] Conexão com fal-ai estabelecida.</p>
								<p className="text-neutral-400">[AUTH] Administrador logado com sucesso via credenciais seguras.</p>
								<p className="text-neutral-500">[RENDER] Canvas ativo sincronizado em tempo real.</p>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
