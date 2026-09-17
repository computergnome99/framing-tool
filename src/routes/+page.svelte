<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onDestroy } from 'svelte';

	let urlValue = $state('');
	let loadedUrl = $state('');
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

	function handleSubmit() {
		if (urlValue === loadedUrl) return;

		revokeObjectUrl();
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
		imageState = 'loading';
		frameType = 'none';
		loadedUrl = objectUrl;

		// allow re-selecting the same file later
		fileInput.value = '';
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

		<input
			bind:this={fileInput}
			onchange={handleFileChange}
			type="file"
			name="file"
			id="file"
			accept="image/*"
			class="border border-gray-500 px-6 py-2 rounded-full file:mr-4 file:rounded-full file:border-0 file:bg-indigo-500 file:text-white file:font-bold file:py-1 file:px-4"
		/>
	</label>

	<hr />

	<div>
		{#if imageState == 'loading'}
			{#if loadedUrl}
				<p class="italic text-gray-700 justify-center items-center flex gap-4">
					<span class="fas fa-spinner-third fa-spin text-indigo-500"></span>
					Loading image...
				</p>
			{:else}
				<p class="text-gray-500 text-center">No image</p>
			{/if}
		{:else if imageState == 'error'}
			<p class="text-red-700 text-center">Invalid image!</p>
		{/if}
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
