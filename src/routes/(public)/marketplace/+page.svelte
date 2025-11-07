<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let sortBy = $state('newest');
	let maxPrice = $state<number | null>(null);
	let minDuration = $state<number | null>(null);
	let maxDuration = $state<number | null>(null);

	function handleSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		searchQuery = target.value.toLowerCase();
	}

	function handleSort(e: Event) {
		const target = e.target as HTMLSelectElement;
		sortBy = target.value;
	}

	function handleMaxPrice(e: Event) {
		const target = e.target as HTMLInputElement;
		maxPrice = target.value ? parseInt(target.value) : null;
	}

	function handleMinDuration(e: Event) {
		const target = e.target as HTMLSelectElement;
		minDuration = target.value && target.value !== '' ? parseInt(target.value) : null;
	}

	function handleMaxDuration(e: Event) {
		const target = e.target as HTMLSelectElement;
		maxDuration = target.value && target.value !== '' ? parseInt(target.value) : null;
	}

	function clearFilters() {
		searchQuery = '';
		sortBy = 'newest';
		maxPrice = null;
		minDuration = null;
		maxDuration = null;
	}

	// Get unique price points and durations for filters
	let maxPriceValue = $derived(Math.max(...data.courses.map((c) => c.price), 0) || 10000000);

	let filteredCourses = $derived.by(() => {
		let courses = data.courses;

		// Search filter
		if (searchQuery) {
			courses = courses.filter(
				(course) =>
					course.title.toLowerCase().includes(searchQuery) ||
					course.description.toLowerCase().includes(searchQuery) ||
					course.mentor?.fullName?.toLowerCase().includes(searchQuery) ||
					course.mentor?.username?.toLowerCase().includes(searchQuery)
			);
		}

	// Price filter
	const maxPriceFilter = maxPrice;
	if (maxPriceFilter !== null) {
		courses = courses.filter((course) => course.price <= maxPriceFilter);
		}

		// Duration filter
	const minDurationFilter = minDuration;
	const maxDurationFilter = maxDuration;
	if (minDurationFilter !== null || maxDurationFilter !== null) {
			courses = courses.filter((course) => {
				// If course has no duration, exclude it only if filters are active
				if (!course.duration) {
					// If only one filter is set (not both), allow courses without duration
				if (minDurationFilter !== null && maxDurationFilter !== null) return false;
					// If only minDuration is set, courses without duration are excluded
				if (minDurationFilter !== null) return false;
					// If only maxDuration is set, allow courses without duration
					return true;
				}
			if (minDurationFilter !== null && course.duration < minDurationFilter) return false;
			if (maxDurationFilter !== null && course.duration > maxDurationFilter) return false;
				return true;
			});
		}

		// Sort
		courses = [...courses].sort((a, b) => {
			switch (sortBy) {
				case 'price-low':
					return a.price - b.price;
				case 'price-high':
					return b.price - a.price;
				case 'duration':
					return (a.duration || 0) - (b.duration || 0);
				case 'newest':
				default:
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			}
		});

		return courses;
	});

	let activeFilterCount = $derived.by(() => {
		let count = 0;
		if (searchQuery) count++;
		if (maxPrice !== null) count++;
		if (minDuration !== null) count++;
		if (maxDuration !== null) count++;
		return count;
	});
</script>

<svelte:head>
	<title>Course Marketplace - Naik Kelas by Koneksi</title>
	<meta
		name="description"
		content="Temukan berbagai kursus programming, AI tools, dan web development dari mentor berpengalaman. Bangun portfolio dan tingkatkan karier tech kamu!"
	/>
	<meta
		name="keywords"
		content="kursus programming, belajar coding, web development, python, AI tools, marketplace kursus"
	/>
	<link rel="canonical" href="https://learning.konxc.space/marketplace" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://learning.konxc.space/marketplace" />
	<meta property="og:title" content="Course Marketplace - Naik Kelas by Koneksi" />
	<meta
		property="og:description"
		content="Temukan berbagai kursus programming, AI tools, dan web development dari mentor berpengalaman."
	/>
	<meta property="og:image" content="https://learning.konxc.space/apple-icon-180x180.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://learning.konxc.space/marketplace" />
	<meta name="twitter:title" content="Course Marketplace - Naik Kelas by Koneksi" />
	<meta
		name="twitter:description"
		content="Temukan berbagai kursus programming, AI tools, dan web development dari mentor berpengalaman."
	/>
	<meta name="twitter:image" content="https://learning.konxc.space/apple-icon-180x180.png" />
</svelte:head>

<div class="marketplace-page">
	<div class="hero-section">
		<h1>🎓 Course Marketplace</h1>
		<p>Pelajari programming, AI tools, dan bangun project nyata bersama mentor berpengalaman</p>
		<div class="stats">
			<span class="stat-item">
				<strong>{filteredCourses.length}</strong> Courses Available
				{#if activeFilterCount > 0}
					<span class="filter-note">(filtered)</span>
				{/if}
			</span>
		</div>
	</div>

	<div class="filters-container">
		<div class="search-bar">
			<div class="search-icon">🔍</div>
			<input
				type="text"
				placeholder="Cari kursus, mentor, atau topik..."
				value={searchQuery}
				oninput={handleSearch}
				class="search-input"
			/>
		</div>

		<div class="filter-row">
			<div class="filter-group">
				<label for="sort">Sort By</label>
				<select id="sort" value={sortBy} onchange={handleSort} class="sort-select">
					<option value="newest">Terbaru</option>
					<option value="price-low">Harga: Rendah ke Tinggi</option>
					<option value="price-high">Harga: Tinggi ke Rendah</option>
					<option value="duration">Durasi: Pendek ke Panjang</option>
				</select>
			</div>

			<div class="filter-group">
				<label for="max-price">Maks Harga</label>
				<input
					id="max-price"
					type="number"
					placeholder="Tidak terbatas"
					value={maxPrice || ''}
					oninput={handleMaxPrice}
					class="filter-input"
					min="0"
					max={maxPriceValue}
				/>
			</div>

			<div class="filter-group">
				<label for="min-duration">Durasi Min (minggu)</label>
				<select
					id="min-duration"
					value={minDuration || ''}
					onchange={handleMinDuration}
					class="filter-select"
				>
					<option value="">Tidak terbatas</option>
					<option value="1">1 minggu</option>
					<option value="4">4 minggu</option>
					<option value="8">8 minggu</option>
					<option value="12">12 minggu</option>
				</select>
			</div>

			<div class="filter-group">
				<label for="max-duration">Durasi Max (minggu)</label>
				<select
					id="max-duration"
					value={maxDuration || ''}
					onchange={handleMaxDuration}
					class="filter-select"
				>
					<option value="">Tidak terbatas</option>
					<option value="4">4 minggu</option>
					<option value="8">8 minggu</option>
					<option value="12">12 minggu</option>
					<option value="16">16 minggu</option>
				</select>
			</div>
		</div>

		{#if activeFilterCount > 0}
			<div class="active-filters">
				<span>{activeFilterCount} filter aktif</span>
				<button onclick={clearFilters} class="clear-btn">✕ Clear All</button>
			</div>
		{/if}
	</div>

	<div class="courses-grid">
		{#each filteredCourses as course}
			<a href="/marketplace/{course.id}" class="course-card">
				{#if course.thumbnailUrl}
					<img src={course.thumbnailUrl} alt={course.title} class="thumbnail" loading="lazy" />
				{:else}
					<div class="thumbnail-placeholder">
						<span class="emoji">📚</span>
					</div>
				{/if}

				{#if course.mentor}
					<div class="mentor-badge">
						<span class="mentor-icon">👨‍🏫</span>
						<span class="mentor-name">{course.mentor.fullName || course.mentor.username}</span>
					</div>
				{/if}

				<div class="course-info">
					<h3>{course.title}</h3>
					<p class="description">{course.description}</p>

					<div class="course-meta">
						<div class="meta-left">
							<span class="price">Rp {course.price.toLocaleString('id-ID')}</span>
							{#if course.duration}
								<span class="duration">{course.duration} minggu</span>
							{/if}
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>

	{#if filteredCourses.length === 0}
		<div class="empty-state">
			<div class="empty-icon">🔍</div>
			<h3>Tidak ada kursus ditemukan</h3>
			<p>
				{#if data.courses.length === 0}
					Belum ada kursus yang tersedia saat ini.
				{:else}
					Coba ubah filter atau kata kunci pencarianmu.
				{/if}
			</p>
			{#if data.courses.length > 0 && activeFilterCount > 0}
				<button onclick={clearFilters} class="clear-filters-btn">Reset Filter</button>
			{/if}
		</div>
	{:else if data.courses.length > 0}
		<div class="results-count">
			Menampilkan <strong>{filteredCourses.length}</strong> dari
			<strong>{data.courses.length}</strong> kursus
		</div>
	{/if}
</div>

<style>
	.marketplace-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 100px 20px 40px;
	}

	.hero-section {
		text-align: center;
		margin-bottom: 48px;
		padding: 40px 20px;
		background: linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-hero-end) 100%);
		border-radius: 20px;
	}

	.hero-section h1 {
		font-size: 3em;
		color: var(--color-primary-dark);
		margin-bottom: 16px;
		font-weight: 700;
	}

	.hero-section p {
		font-size: 1.2em;
		color: var(--color-primary-medium);
		margin-bottom: 24px;
	}

	.stats {
		display: flex;
		justify-content: center;
		gap: 32px;
		flex-wrap: wrap;
	}

	.stat-item {
		padding: 12px 24px;
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		color: var(--color-primary-dark);
	}

	.stat-item strong {
		color: var(--color-gradient-purple-start);
		font-size: 1.5em;
	}

	.filter-note {
		font-size: 0.7em;
		color: var(--color-primary-medium);
		margin-left: 8px;
		font-weight: normal;
	}

	.filters-container {
		background: white;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
	}

	.search-bar {
		position: relative;
		margin-bottom: 24px;
	}

	.search-icon {
		position: absolute;
		left: 20px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.2em;
	}

	.search-input {
		width: 100%;
		padding: 16px 20px 16px 60px;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		font-size: 1em;
		transition: all 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.filter-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.filter-group label {
		font-size: 0.9em;
		font-weight: 600;
		color: var(--color-primary-dark);
	}

	.sort-select,
	.filter-select,
	.filter-input {
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		font-size: 0.95em;
		transition: all 0.2s ease;
		background: white;
	}

	.filter-input {
		padding: 12px 16px;
	}

	.sort-select:focus,
	.filter-select:focus,
	.filter-input:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.active-filters {
		margin-top: 20px;
		padding: 16px;
		background: var(--color-bg-hero);
		border-radius: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.active-filters span {
		color: var(--color-primary-medium);
		font-size: 0.9em;
	}

	.clear-btn {
		background: var(--color-gradient-purple-start);
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.clear-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 32px;
		margin-bottom: 48px;
	}

	.course-card {
		background: white;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease;
		display: block;
		position: relative;
	}

	.course-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
	}

	.thumbnail,
	.thumbnail-placeholder {
		width: 100%;
		height: 220px;
		object-fit: cover;
		background: linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-hero-end) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.thumbnail-placeholder .emoji {
		font-size: 5em;
		opacity: 0.3;
	}

	.mentor-badge {
		position: absolute;
		top: 16px;
		right: 16px;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		padding: 8px 14px;
		border-radius: 20px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85em;
		font-weight: 600;
		color: var(--color-primary-dark);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.mentor-icon {
		font-size: 1.2em;
	}

	.mentor-name {
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.course-info {
		padding: 24px;
	}

	.course-info h3 {
		font-size: 1.4em;
		color: var(--color-primary-dark);
		margin-bottom: 12px;
		font-weight: 600;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		min-height: 3.5em;
	}

	.description {
		color: var(--color-primary-medium);
		line-height: 1.6;
		margin-bottom: 20px;
		min-height: 60px;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.course-meta {
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}

	.meta-left {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.price {
		font-size: 1.5em;
		font-weight: 700;
		color: var(--color-gradient-purple-start);
	}

	.duration {
		color: var(--color-primary-medium);
		font-size: 0.9em;
		background: var(--color-bg-hero);
		padding: 6px 12px;
		border-radius: 8px;
		display: inline-block;
		width: fit-content;
	}

	.empty-state {
		text-align: center;
		padding: 80px 20px;
		background: white;
		border-radius: 20px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	}

	.empty-icon {
		font-size: 5em;
		margin-bottom: 24px;
		opacity: 0.3;
	}

	.empty-state h3 {
		font-size: 1.8em;
		color: var(--color-primary-dark);
		margin-bottom: 12px;
	}

	.empty-state p {
		font-size: 1.1em;
		color: var(--color-primary-medium);
		margin-bottom: 24px;
	}

	.clear-filters-btn {
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		border: none;
		padding: 14px 32px;
		border-radius: 12px;
		cursor: pointer;
		font-weight: 600;
		font-size: 1em;
		transition: all 0.3s ease;
	}

	.clear-filters-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
	}

	.results-count {
		text-align: center;
		padding: 20px;
		color: var(--color-primary-medium);
		font-size: 1em;
	}

	.results-count strong {
		color: var(--color-primary-dark);
		font-weight: 600;
	}

	/* Responsive: Tablet */
	@media (max-width: 1024px) {
		.hero-section h1 {
			font-size: 2.5em;
		}

		.filter-row {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Responsive: Mobile */
	@media (max-width: 768px) {
		.marketplace-page {
			padding: 90px 16px 20px;
		}

		.hero-section {
			padding: 32px 20px;
		}

		.hero-section h1 {
			font-size: 2em;
		}

		.hero-section p {
			font-size: 1em;
		}

		.filters-container {
			padding: 24px;
		}

		.filter-row {
			grid-template-columns: 1fr;
		}

		.courses-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.course-card {
			border-radius: 16px;
		}

		.mentor-badge {
			top: 12px;
			right: 12px;
			padding: 6px 12px;
			font-size: 0.75em;
		}

		.results-count {
			font-size: 0.9em;
		}
	}

	/* Responsive: Small mobile */
	@media (max-width: 480px) {
		.hero-section h1 {
			font-size: 1.6em;
		}

		.stat-item {
			padding: 10px 16px;
			font-size: 0.9em;
		}

		.mentor-name {
			max-width: 80px;
		}
	}
</style>
