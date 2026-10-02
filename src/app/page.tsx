/* eslint-disable @next/next/no-img-element */
'use client'

import { LiveImageShape, LiveImageShapeUtil } from '@/components/LiveImageShapeUtil'
import { LiveImageTool,MakeLiveButton } from '@/components/LiveImageTool'
import { LockupLink } from '@/components/LockupLink'
import { LiveImageProvider } from '@/hooks/useLiveImage'
import * as fal from '@fal-ai/serverless-client'
import {
	AssetRecordType,
	DefaultSizeStyle,
	Editor,
	TLUiOverrides,
	Tldraw,
	toolbarItem,
	track,
	useEditor,
} from '@tldraw/tldraw'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

fal.config({
	requestMiddleware: fal.withProxy({
		targetUrl: '/api/fal/proxy',
	}),
})

const overrides: TLUiOverrides = {
	tools(editor, tools) {
		tools.liveImage = {
			id: 'live-image',
			icon: 'tool-frame',
			label: 'Frame',
			kbd: 'f',
			readonlyOk: false,
			onSelect: () => {
				editor.setCurrentTool('live-image')
			},
		}
		return tools
	},
	toolbar(_app, toolbar, { tools }) {
		const frameIndex = toolbar.findIndex((item) => item.id === 'frame')
		if (frameIndex !== -1) toolbar.splice(frameIndex, 1)
		const highlighterIndex = toolbar.findIndex((item) => item.id === 'highlight')
		if (highlighterIndex !== -1) {
			const highlighterItem = toolbar[highlighterIndex]
			toolbar.splice(highlighterIndex, 1)
			toolbar.splice(3, 0, highlighterItem)
		}
		toolbar.splice(2, 0, toolbarItem(tools.liveImage))
		return toolbar
	},
}

const shapeUtils = [LiveImageShapeUtil]
const tools = [LiveImageTool]

export default function Home() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault()
		if (username === 'admin' && password === 'admin123') {
			setIsAuthenticated(true)
			setError('')
		} else {
			setError('Usuário ou senha inválidos')
		}
	}

	if (!isAuthenticated) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
				<div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
					<h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Painel Admin</h1>
					<form onSubmit={handleLogin} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Usuário</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Senha</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
								required
							/>
						</div>
						{error && <p className="text-sm text-red-600">{error}</p>}
						<button
							type="submit"
							className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 transition"
						>
							Entrar
						</button>
					</form>
				</div>
			</main>
		)
	}

	const onEditorMount = (editor: Editor) => {
		// We need the editor to think that the live image shape is a frame
		// @ts-expect-error: patch
		editor.isShapeOfType = function (arg, type) {
			const shape = typeof arg === 'string' ? this.getShape(arg)! : arg
			if (shape.type === 'live-image' && type === 'frame') {
				return true
			}
			return shape.type === type
		}

		// If there isn't a live image shape, create one
		if (!editor.getCurrentPageShapes().some((shape) => shape.type === 'live-image')) {
			editor.createShape<LiveImageShape>({
				type: 'live-image',
				x: 120,
				y: 180,
				props: {
					w: 512,
					h: 512,
					name: '',
				},
			})
		}

		editor.setStyleForNextShapes(DefaultSizeStyle, 'xl', { ephemeral: true })
	}

	return (
		<LiveImageProvider appId="110602490-lcm-sd15-i2i">
			<main className="tldraw-wrapper">
				<div className="tldraw-wrapper__inner">
					<Tldraw
						persistenceKey="tldraw-fal"
						onMount={onEditorMount}
						shapeUtils={shapeUtils}
						tools={tools}
						shareZone={<MakeLiveButton />}
						overrides={overrides}
					>
						<SneakySideEffects />
						<LockupLink />
						<LiveImageAssets />
					</Tldraw>
				</div>
			</main>
		</LiveImageProvider>
	)
}

function SneakySideEffects() {
	const editor = useEditor()

	useEffect(() => {
		editor.sideEffects.registerAfterChangeHandler('shape', () => {
			editor.emit('update-drawings' as any)
		})
		editor.sideEffects.registerAfterCreateHandler('shape', () => {
			editor.emit('update-drawings' as any)
		})
		editor.sideEffects.registerAfterDeleteHandler('shape', () => {
			editor.emit('update-drawings' as any)
		})
	}, [editor])

	return null
}

const LiveImageAssets = track(function LiveImageAssets() {
	const editor = useEditor()

	return (
		<Inject selector=".tl-overlays .tl-html-layer">
			{editor
				.getCurrentPageShapes()
				.filter((shape): shape is LiveImageShape => shape.type === 'live-image')
				.map((shape) => (
					<LiveImageAsset key={shape.id} shape={shape} />
				))}
		</Inject>
	)
})

const LiveImageAsset = track(function LiveImageAsset({ shape }: { shape: LiveImageShape }) {
	const editor = useEditor()

	if (!shape.props.overlayResult) return null

	const transform = editor.getShapePageTransform(shape).toCssString()
	const assetId = AssetRecordType.createId(shape.id.split(':')[1])
	const asset = editor.getAsset(assetId)
	return (
		asset &&
		asset.props.src && (
			<img
				src={asset.props.src!}
				alt={shape.props.name}
				width={shape.props.w}
				height={shape.props.h}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: shape.props.w,
					height: shape.props.h,
					maxWidth: 'none',
					transform,
					transformOrigin: 'top left',
					opacity: shape.opacity,
				}}
			/>
		)
	)
})

function Inject({ children, selector }: { children: React.ReactNode; selector: string }) {
	const [parent, setParent] = useState<Element | null>(null)
	const target = useMemo(() => parent?.querySelector(selector) ?? null, [parent, selector])

	return (
		<>
			<div ref={(el) => setParent(el?.parentElement ?? null)} style={{ display: 'none' }} />
			{target && createPortal(children, target)}
		</>
	)
}
