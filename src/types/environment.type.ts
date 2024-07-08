import type { UnknownRecord } from 'type-fest';

export type TEnvironment<T extends UnknownRecord = UnknownRecord> = Record<keyof T, unknown> & {
	NODE_ENV: string
}
