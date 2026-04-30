import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseClientService {
  private clientInstance?: SupabaseClient;

  get client(): SupabaseClient {
    if (!this.clientInstance) {
      this.clientInstance = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    }

    return this.clientInstance;
  }
}
