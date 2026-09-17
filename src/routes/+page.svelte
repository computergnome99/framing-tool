<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onDestroy } from 'svelte';

	let urlValue = $state('');
	let loadedUrl = $state('');
	let fileName = $state('');
	let objectUrl: string | null = null;
	let fileInput: HTMLInputElement = $state();
	let imageState: 'loading' | 'ready' | 'error' = $state('loading');
	let frameType: 'none' | 'thirds' | 'golden' = $state('none');

	function revokeObjectUrl() {
		if (objectUrl) {
			URL.revokeObjectURL(objectUrl);
			objectUrl = null;
		}
	}

	function clearFileInput() {
		fileInput.value = '';
		fileName = '';
	}

	function handleSubmit() {
		if (urlValue === loadedUrl) return;

		revokeObjectUrl();
		clearFileInput();
		imageState = 'loading';
		frameType = 'none';

		loadedUrl = urlValue;
	}

	function handleFileChange(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;

		revokeObjectUrl();
		objectUrl = URL.createObjectURL(file);

		urlValue = '';
		fileName = file.name;
		imageState = 'loading';
		frameType = 'none';
		loadedUrl = objectUrl;
	}

	onDestroy(revokeObjectUrl);
</script>

<div class="p-10 gap-10 grid">
	<h1 class="text-3xl text-center text-bold">Framing Tester</h1>

	<hr />

	<form
		onsubmit={preventDefault(handleSubmit)}
		class="grid grid-cols-[1fr_auto] gap-4 items-end"
	>
		<label for="url" class="grid">
			<span>Image URL</span>

			<input
				type="text"
				name="url"
				id="url"
				bind:value={urlValue}
				placeholder="Paste Image URL Here..."
				class="border border-gray-500 px-6 py-2 rounded-full placeholder:italic"
			/>
		</label>

		<button
			type="submit"
			disabled={!urlValue}
			class="rounded-full bg-indigo-500 text-white font-bold py-2 px-6 disabled:bg-gray-100 disabled:text-black disabled:font-normal disabled:opacity-50"
		>
			<span class="fas fa-floppy-disk"></span> Load
		</button>
	</form>

	<div class="flex items-center gap-4 text-gray-500">
		<hr class="flex-1" />
		<span class="italic">or</span>
		<hr class="flex-1" />
	</div>

	<label for="file" class="grid">
		<span>Upload Image</span>

		<div
			class="relative border border-gray-500 rounded-full flex items-center gap-4 pl-1 pr-6 py-1"
		>
			<span
				class="rounded-full bg-indigo-500 text-white font-bold py-1 px-4 whitespace-nowrap"
			>
				Choose File
			</span>
			<span class="truncate {fileName ? '' : 'text-gray-500 italic'}">
				{fileName || 'No file chosen'}
			</span>
			<input
				bind:this={fileInput}
				onchange={handleFileChange}
				type="file"
				name="file"
				id="file"
				accept="image/*"
				class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
			/>
		</div>
	</label>

	<hr />

	<div>
		{#if !loadedUrl}
			<div
				class="h-96 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 text-center px-6"
			>
				<span class="fas fa-image text-4xl text-gray-400"></span>
				<p class="text-gray-500">
					Paste an image URL or upload a file to preview it here.
				</p>
			</div>
		{:else if imageState == 'loading'}
			<div
				class="h-96 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 text-center px-6"
			>
				<span class="fas fa-spinner-third fa-spin text-4xl text-indigo-500"
				></span>
				<p class="italic text-gray-700">Loading image...</p>
			</div>
		{:else if imageState == 'error'}
			<div
				class="h-96 rounded-2xl border-2 border-dashed border-red-300 flex flex-col items-center justify-center gap-3 text-center px-6"
			>
				<span class="fas fa-triangle-exclamation text-4xl text-red-500"></span>
				<p class="text-red-700 font-bold">Couldn't load that image</p>
				<p class="text-gray-500 text-sm">
					Double check the URL, or try a different file.
				</p>
			</div>
		{/if}
		{#if loadedUrl}
			<div
				class="relative flex justify-center h-96 {imageState != 'ready'
					? 'hidden'
					: 'block'}"
			>
				<div
					class="absolute w-full h-full bg-center bg-cover blur-xl brightness-50"
					style="background-image: url('{loadedUrl}');"
				></div>
				<div class="h-96 flex relative">
					<img
						src={loadedUrl}
						class="relative object-contain"
						alt="User loaded"
						onload={() => (imageState = 'ready')}
						onerror={() => (imageState = 'error')}
					/>
					{#if frameType == 'thirds'}
						<div
							class="absolute top-0 w-full h-full"
							style="background-image: url('rule-of-thirds.svg')"
						></div>
					{:else if frameType == 'golden'}
						<div
							class="absolute top-0 w-full h-full"
							style="background-image: url('golden-ratio.svg')"
						></div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<br />

	{#if imageState == 'ready'}
		<div class="flex flex-col gap-4">
			<label for="none">
				<input
					bind:group={frameType}
					type="radio"
					name="frame"
					id="none"
					value="none"
					checked
				/>
				None
			</label>
			<label for="thirds">
				<input
					bind:group={frameType}
					type="radio"
					name="frame"
					id="thirds"
					value="thirds"
				/>
				Rule of Thirds
			</label>
			<label for="golden">
				<input
					bind:group={frameType}
					type="radio"
					name="frame"
					id="golden"
					value="golden"
				/>
				Golden Ratio
			</label>
		</div>
	{/if}
</div>
