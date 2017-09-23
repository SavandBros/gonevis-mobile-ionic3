/**
 * Representing GoNevis API Response on Lists.
 */
export class GoNevisAPIResponse<T> {
  constructor(public count: Number, public next: string | null, public previous: string | null, public results: Array<T>) {}
}
