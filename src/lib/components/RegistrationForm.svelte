<script lang="ts">
	// TypeScript interface untuk form data
	export interface RegistrationData {
		name: string;
		email: string;
		phone: string;
		education: 'smp' | 'sma' | 'mahasiswa' | 'lulusan' | 'lainnya' | '';
		experience?: string;
		motivation: string;
	}

	interface Props {
		onSubmit?: (data: RegistrationData) => void;
	}

	let { onSubmit }: Props = $props();

	// State management
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		error = null;

		try {
			const form = e.target as HTMLFormElement;
			const formData = new FormData(form);
			const data: RegistrationData = {
				name: formData.get('name') as string,
				email: formData.get('email') as string,
				phone: formData.get('phone') as string,
				education: formData.get('education') as RegistrationData['education'],
				experience: formData.get('experience') as string | undefined,
				motivation: formData.get('motivation') as string
			};

			// Validation
			if (!data.name || !data.email || !data.phone || !data.education || !data.motivation) {
				throw new Error('Mohon lengkapi semua field yang wajib diisi');
			}

			// Email validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(data.email)) {
				throw new Error('Email tidak valid');
			}

			// Phone validation (basic)
			if (data.phone.length < 10) {
				throw new Error('Nomor WhatsApp tidak valid');
			}

			console.log('Form submitted:', data);

			if (onSubmit) {
				await onSubmit(data);
			}

			success = true;
			form.reset();

			// Reset success message after 3 seconds
			setTimeout(() => {
				success = false;
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="registration-form">
	<form id="registrationForm" onsubmit={handleSubmit}>
		<!-- Error message -->
		{#if error}
			<div class="error-message" role="alert" aria-live="polite">
				<strong>⚠️ Error:</strong>
				{error}
			</div>
		{/if}

		<!-- Success message -->
		{#if success}
			<div class="success-message" role="alert" aria-live="polite">
				<strong>🎉 Sukses!</strong> Terima kasih sudah mendaftar! Tim kami akan menghubungi kamu segera
				via WhatsApp atau Email.
			</div>
		{/if}

		<div class="form-group">
			<label for="name">Nama Lengkap *</label>
			<input
				type="text"
				id="name"
				name="name"
				required
				aria-required="true"
				placeholder="Masukkan nama lengkap kamu"
				autocomplete="name"
			/>
		</div>

		<div class="form-group">
			<label for="email">Email *</label>
			<input
				type="email"
				id="email"
				name="email"
				required
				aria-required="true"
				placeholder="email@example.com"
				autocomplete="email"
			/>
		</div>

		<div class="form-group">
			<label for="phone">WhatsApp *</label>
			<input
				type="tel"
				id="phone"
				name="phone"
				required
				aria-required="true"
				placeholder="08123456789"
				autocomplete="tel"
			/>
		</div>

		<div class="form-group">
			<label for="education">Status Pendidikan *</label>
			<select id="education" name="education" required aria-required="true">
				<option value="">Pilih status pendidikan</option>
				<option value="smp">SMP / Sederajat</option>
				<option value="sma">SMA/SMK / Sederajat</option>
				<option value="mahasiswa">Mahasiswa</option>
				<option value="lulusan">Fresh Graduate</option>
				<option value="lainnya">Lainnya</option>
			</select>
		</div>

		<div class="form-group">
			<label for="experience">Pengalaman Coding (Optional)</label>
			<textarea
				id="experience"
				name="experience"
				rows="3"
				placeholder="Ceritakan sedikit tentang pengalaman coding kamu (jika ada). Tidak punya pengalaman? No problem!"
			></textarea>
		</div>

		<div class="form-group">
			<label for="motivation">Kenapa Kamu Tertarik? *</label>
			<textarea
				id="motivation"
				name="motivation"
				rows="4"
				required
				aria-required="true"
				placeholder="Apa yang membuat kamu ingin jadi developer?"
			></textarea>
		</div>

		<button type="submit" class="btn-submit" disabled={isSubmitting} aria-busy={isSubmitting}>
			{#if isSubmitting}
				<span class="spinner"></span>
				Mengirim...
			{:else}
				Daftar Sekarang!
			{/if}
		</button>
	</form>
</div>

<style>
	.registration-form {
		background: white;
		padding: 50px;
		border-radius: 20px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		max-width: 600px;
		margin: 0 auto;
		animation: slideUp 0.5s ease;
	}

	/* Animation keyframes are defined in app.css */

	.form-group {
		margin-bottom: 25px;
		text-align: left;
	}

	.form-group label {
		display: block;
		color: var(--color-primary-dark);
		font-weight: 600;
		margin-bottom: 8px;
		font-size: 1em;
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		width: 100%;
		padding: 15px;
		border: 2px solid rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		font-size: 1em;
		transition: all 0.3s ease;
		font-family: inherit;
		color: var(--color-primary-dark);
		background: var(--color-bg-light);
	}

	/* Placeholder styling */
	.form-group input::placeholder,
	.form-group textarea::placeholder {
		color: var(--color-text-secondary);
		opacity: 0.7;
	}

	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
		background: white;
	}

	/* Select dropdown styling */
	.form-group select {
		cursor: pointer;
	}

	.form-group select option {
		color: var(--color-primary-dark);
		background: white;
	}

	.btn-submit {
		width: 100%;
		padding: 18px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 1.2em;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
	}

	.btn-submit:hover {
		transform: translateY(-3px);
		box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
	}

	.btn-submit:active {
		transform: translateY(-1px);
	}

	/* Error & Success Messages */
	.error-message,
	.success-message {
		padding: 15px;
		border-radius: 10px;
		margin-bottom: 20px;
		font-size: 0.95em;
		line-height: 1.5;
	}

	.error-message {
		background: #fef2f2;
		border: 2px solid #fecaca;
		color: #dc2626;
	}

	.error-message strong {
		color: #991b1b;
	}

	.success-message {
		background: #f0fdf4;
		border: 2px solid #bbf7d0;
		color: #16a34a;
	}

	.success-message strong {
		color: #15803d;
	}

	/* Loading State */
	.btn-submit:disabled {
		opacity: 0.7;
		cursor: not-allowed;
		transform: none !important;
	}

	.spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
		margin-right: 8px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Responsive: Tablet */
	@media (max-width: 1024px) {
		.registration-form {
			padding: 40px 35px;
			max-width: 550px;
		}
	}

	/* Responsive: Mobile */
	@media (max-width: 768px) {
		.registration-form {
			padding: 30px 25px;
			max-width: 100%;
		}

		.form-group label {
			font-size: 0.95em;
		}

		.form-group input,
		.form-group select,
		.form-group textarea {
			padding: 12px;
			font-size: 16px; /* Prevents zoom on iOS */
		}

		.btn-submit {
			padding: 16px;
			font-size: 1.1em;
		}

		.error-message,
		.success-message {
			font-size: 0.9em;
			padding: 12px;
		}
	}

	/* Responsive: Small mobile */
	@media (max-width: 480px) {
		.registration-form {
			padding: 20px 15px;
		}

		.form-group label {
			font-size: 0.9em;
		}

		.form-group input,
		.form-group select,
		.form-group textarea {
			padding: 10px;
			font-size: 14px;
		}

		.btn-submit {
			padding: 14px;
			font-size: 1em;
		}
	}
</style>
