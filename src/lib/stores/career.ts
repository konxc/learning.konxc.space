import { writable } from 'svelte/store';

export type CareerOption = 'Developer' | 'Akademik' | 'Bisnis & UMKM' | 'UI/UX Design' | 'Outdoor Adventure';

export const careerStore = writable<CareerOption>('Developer');

export function setCareer(career: CareerOption) {
	careerStore.set(career);
}

