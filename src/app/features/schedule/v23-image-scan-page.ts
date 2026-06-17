import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ScheduleService } from '../../core/services/schedule.service';
import { AuthService } from '../../core/services/auth.service';
import { createScheduleId } from '../../core/services/schedule-id.util';
import type { Schedule } from '../../shared/models/schedule.model';
import { dayLabel } from '../../shared/utils/day-label.util';

@Component({
  selector: 'app-v23-image-scan-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>📷 Escanear Imagen</h2>
        <p>Captura o selecciona una foto de tu horario. La extracción OCR estará disponible en una fase futura.</p>
      </div>

      <div class="upload-area" [class.has-image]="selectedImage()">
        <label class="file-input-label">
          <input
            type="file"
            accept="image/*"
            class="file-input"
            (change)="onImageSelected($event)"
            aria-label="Selecciona imagen de horario"
          />
          <span class="upload-icon">📷</span>
          <span class="upload-text">
            @if (selectedImage()) {
              {{ selectedImage()?.name }}
            } @else {
              Selecciona o arrastra una imagen aquí
            }
          </span>
        </label>
      </div>

      @if (imagePreview()) {
        <div class="image-preview">
          <img [src]="imagePreview()" alt="Horario capturado" class="preview-img" />
        </div>
      }

      @if (extractedClasses().length > 0) {
        <div class="extracted-card">
          <h3>Clases extraídas ({{ extractedClasses().length }})</h3>
          <div class="preview-list">
            @for (item of extractedClasses(); track $index) {
              <article class="preview-item">
                <strong>{{ item.subject }}</strong>
                <p>{{ dayLabel(item.day_of_week) }} • {{ item.start_time }} – {{ item.end_time }}</p>
                <small>{{ item.room_label || 'Sin salón asignado' }}</small>
              </article>
            }
          </div>
        </div>
      }

      <div class="actions">
        <button type="button" class="btn-secondary" (click)="clearImage()" [disabled]="!selectedImage()">
          Limpiar
        </button>
        <button type="button" class="btn-primary" [disabled]="extractedClasses().length === 0" (click)="saveExtracted()">
          Guardar {{ extractedClasses().length }} clase(s)
        </button>
      </div>

      @if (message()) {
        <p class="feedback" role="status">{{ message() }}</p>
      }

      <div class="nav-actions">
        <a routerLink="/app/schedule/v24" class="back-link">Ir al gestor de horario</a>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        background-color: #a0d0c8;
        background-image: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
        background-size: 100% 100vh;
        background-repeat: no-repeat;
      }

      .page-content { padding: 1.25rem; }

      .page-header { margin-bottom: 1.25rem; }
      .page-header h2 { margin: 0 0 0.25rem; font-size: 1.4rem; font-weight: 700; color: #0a709c; }
      .page-header p { margin: 0; color: #64748b; font-size: 0.9rem; }

      .upload-area {
        border-radius: 14px;
        border: 2px dashed rgba(10, 112, 156, 0.3);
        background: rgba(255, 255, 255, 0.5);
        padding: 2rem 1rem;
        text-align: center;
        transition: all 0.3s ease;
        margin-bottom: 1rem;
      }

      .upload-area.has-image {
        border-color: #0a709c;
        background: rgba(10, 112, 156, 0.08);
      }

      .file-input-label { cursor: pointer; display: grid; gap: 0.75rem; align-items: center; }
      .file-input { display: none; }
      .upload-icon { font-size: 2.5rem; display: block; }
      .upload-text { font-size: 0.95rem; color: #0a709c; font-weight: 500; }

      .image-preview {
        border-radius: 14px;
        border: 1px solid rgba(10, 112, 156, 0.2);
        background: rgba(255, 255, 255, 0.6);
        overflow: hidden;
        padding: 0.5rem;
        margin-bottom: 1rem;
      }

      .preview-img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 10px;
        max-height: 300px;
        object-fit: contain;
      }

      .extracted-card {
        border-radius: 14px;
        background: linear-gradient(135deg, #0a709c, #3fa779) !important;
        padding: 1rem;
        color: #ffffff;
        margin-bottom: 1rem;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      }

      .extracted-card h3 { margin: 0 0 0.75rem; color: #ffffff; }
      .preview-list { display: grid; gap: 0.5rem; }

      .preview-item {
        background: rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 0.6rem 0.75rem;
      }

      .preview-item strong { color: #ffffff; }
      .preview-item p { margin: 0.2rem 0; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
      .preview-item small { color: rgba(255,255,255,0.7); }

      .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; }

      .btn-primary {
        min-height: 48px; border-radius: 12px; border: none;
        padding: 0.75rem 1.25rem; font: inherit; cursor: pointer;
        background: #e8c843; color: #1a1a2e; font-weight: 600;
      }
      .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

      .btn-secondary {
        min-height: 48px; border-radius: 12px; border: 2px solid #0a709c;
        padding: 0.75rem 1.25rem; font: inherit; cursor: pointer;
        background: transparent; color: #0a709c; font-weight: 600;
      }
      .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }

      .feedback { color: #0a709c; font-weight: 500; }
      .nav-actions { margin-top: 1rem; }
      .back-link { color: #0a709c; text-decoration: none; font-weight: 600; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V23ImageScanPage implements OnInit {
  private readonly scheduleService = inject(ScheduleService);
  private readonly authService = inject(AuthService);

  protected readonly selectedImage = signal<File | null>(null);
  protected readonly imagePreview = signal<string>('');
  protected readonly extractedClasses = signal<Schedule[]>([]);
  protected readonly message = signal('');
  protected readonly dayLabel = dayLabel;

  ngOnInit(): void {
    this.message.set(
      'Captura o selecciona una foto de tu horario. La extracción automática se habilitará cuando el OCR esté conectado.'
    );
  }

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.message.set('Por favor, selecciona una imagen válida (JPG, PNG, etc.).');
      return;
    }

    this.selectedImage.set(file);
    this.message.set(
      `Imagen "${file.name}" lista. La extracción automática se habilitará cuando el OCR esté conectado.`
    );

    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview.set(typeof e.target?.result === 'string' ? e.target.result : '');
    };
    reader.readAsDataURL(file);
  }

  protected clearImage(): void {
    this.selectedImage.set(null);
    this.imagePreview.set('');
    this.extractedClasses.set([]);
    this.message.set('Selecciona otra imagen para continuar.');
  }

  protected saveExtracted(): void {
    if (this.extractedClasses().length === 0) {
      this.message.set('No hay clases extraídas para guardar.');
      return;
    }

    const userId = this.authService.userSnapshot?.id;

    if (!userId) {
      this.message.set('Inicia sesión para guardar un horario real.');
      return;
    }

    const currentSchedules = this.scheduleService.schedulesSnapshot;
    const newSchedules = this.extractedClasses().map((item) => ({
      ...item,
      id: createScheduleId('image'),
      user_id: userId
    }));

    this.scheduleService.setSchedules([...currentSchedules, ...newSchedules]);
    this.clearImage();
    this.message.set(`Horario guardado con ${newSchedules.length} clase(s) de la imagen.`);
  }
}
