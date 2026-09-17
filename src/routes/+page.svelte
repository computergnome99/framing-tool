<script lang="ts">
	let urlValue = '';
	let loadedUrl = '';
	let imageState: 'loading' | 'ready' | 'error' = 'loading';
	let frameType: 'none' | 'thirds' | 'golden' = 'none';

	function handleSubmit() {
		if (urlValue === loadedUrl) return;

		imageState = 'loading';
		frameType = 'none';

		loadedUrl = urlValue;
	}
</script>

<div class="p-10 gap-10 grid">
	<h1 class="text-3xl text-center text-bold">Framing Tester</h1>

	<hr />

	<form
		on:submit|preventDefault={handleSubmit}
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
			<span class="fas fa-floppy-disk" /> Load
		</button>
	</form>

	<hr />

	<div>
		{#if imageState == 'loading'}
			{#if loadedUrl}
				<p class="italic text-gray-700 justify-center items-center flex gap-4">
					<span class="fas fa-spinner-third fa-spin text-indigo-500" />
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
			/>
			<div class="h-96 flex relative">
				<img
					src={loadedUrl}
					class="relative object-contain"
					alt="User loaded"
					on:load={() => (imageState = 'ready')}
					on:error={() => (imageState = 'error')}
				/>
				{#if frameType == 'thirds'}
					<div
						class="absolute top-0 w-full h-full"
						style="background-image: url('rule-of-thirds.svg')"
					/>
				{:else if frameType == 'golden'}
					<div
						class="absolute top-0 w-full h-full"
						style="background-image: url('golden-ratio.svg')"
					/>
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
