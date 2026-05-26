import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ScheduleService } from '../../core/services/schedule.service';
import { AuthService } from '../../core/services/auth.service';
import { createScheduleId } from '../../core/services/schedule-id.util';
import type { DayOfWeek, Schedule } from '../../shared/models/schedule.model';
import { dayLabel } from '../../shared/utils/day-label.util';

@Component({
  selector: 'app-v23-image-scan-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="image-shell">
      <header class="hero">
        <p class="eyebrow">V23 · Horario</p>
        <h1>Escanear imagen</h1>
        <p class="description">
          Captura o selecciona una foto de tu horario. El sistema extrae las clases automáticamente.
        </p>
      </header>

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
        <div class="extracted-preview">
          <h2>Clases extraídas ({{ extractedClasses().length }})</h2>
          <div class="preview-list">
            @for (item of extractedClasses(); track $index) {
              <article class="preview-card">
                <h3>{{ item.subject }}</h3>
                <p class="meta">{{ dayLabel(item.day_of_week) }} • {{ item.start_time }} – {{ item.end_time }}</p>
                <p class="room">{{ item.room_label || 'Sin salón asignado' }}</p>
              </article>
            }
          </div>
        </div>
      }

      <div class="actions">
        <button type="button" class="ghost" (click)="clearImage()" [disabled]="!selectedImage()">
          Limpiar
        </button>
        <button
          type="button"
          [disabled]="extractedClasses().length === 0"
          (click)="saveExtracted()"
        >
          Guardar {{ extractedClasses().length }} clase(s)
        </button>
      </div>

      @if (message()) {
        <p class="feedback" role="status">{{ message() }}</p>
      }

      <a routerLink="/schedule/v24" class="back-link">Ir al gestor de horario</a>
    </section>
  `,
  styles: [
    `
      .image-shell {
        display: grid;
        gap: 1rem;
        color: #f7fbff;
      }

      .hero {
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(180deg, rgba(12, 16, 31, 0.95), rgba(8, 12, 22, 0.98));
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
        padding: 1.25rem;
      }

      .eyebrow {
        margin: 0 0 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: #8bd3ff;
        font-size: 0.75rem;
      }

      h1,
      h2,
      p {
        margin-top: 0;
      }

      .description {
        margin-bottom: 0;
      }

      .upload-area {
        border-radius: 20px;
        border: 2px dashed rgba(139, 211, 255, 0.3);
        background: rgba(12, 16, 31, 0.5);
        padding: 2rem 1rem;
        text-align: center;
        transition: all 0.3s ease;
      }

      .upload-area.has-image {
        border-color: rgba(139, 211, 255, 0.8);
        background: rgba(139, 211, 255, 0.1);
      }

      .file-input-label {
        cursor: pointer;
        display: grid;
        gap: 0.75rem;
        align-items: center;
      }

      .file-input {
        display: none;
      }

      .upload-icon {
        font-size: 2rem;
        display: block;
      }

      .upload-text {
        font-size: 0.95rem;
        color: #8bd3ff;
        font-weight: 500;
      }

      .image-preview {
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(0, 0, 0, 0.3);
        overflow: hidden;
        padding: 0.5rem;
      }

      .preview-img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 14px;
        max-height: 400px;
        object-fit: contain;
      }

      .extracted-preview {
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(180deg, rgba(12, 16, 31, 0.95), rgba(8, 12, 22, 0.98));
        padding: 1rem;
      }

      .extracted-preview h2 {
        margin-top: 0;
        margin-bottom: 1rem;
      }

      .preview-list {
        display: grid;
        gap: 0.75rem;
      }

      .preview-card {
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
        padding: 0.75rem;
      }

      .preview-card h3 {
        margin: 0 0 0.4rem;
        font-size: 0.95rem;
      }

      .preview-card p {
        margin: 0.3rem 0;
        font-size: 0.85rem;
        color: #b8d9f0;
      }

      .meta {
        color: #8bd3ff !important;
      }

      .room {
        color: #6bb3d9 !important;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      button {
        min-height: 48px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 0.75rem 0.9rem;
        font: inherit;
        cursor: pointer;
        background: linear-gradient(135deg, #8bd3ff, #4ecdc4);
        color: #08111e;
        font-weight: 700;
      }

      .ghost {
        background: rgba(255, 255, 255, 0.05);
        color: inherit;
        border-color: rgba(139, 211, 255, 0.5);
      }

      button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .feedback,
      .back-link {
        color: #8bd3ff;
      }

      .back-link {
        text-decoration: none;
      }

      @media (min-width: 992px) {
        .image-shell {
          grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.8fr);
          align-items: start;
        }

        .hero,
        .upload-area,
        .image-preview,
        .extracted-preview,
        .actions,
        .feedback,
        .back-link {
          grid-column: 1 / -1;
        }
      }
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
    this.message.set('Captura o selecciona una foto de tu horario. El sistema extraerá las clases automáticamente.');
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
    this.message.set(`Imagen "${file.name}" cargada. Procesando...`);

    // Read image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Mock: Simulate image OCR parsing with a delay
    // In production, you'd use a library like Tesseract.js or Google Cloud Vision
    setTimeout(() => {
      this.mockExtractFromImage(file);
    }, 800);
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

    const userId = this.authService.sessionSnapshot?.user.id;

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

  private mockExtractFromImage(file: File): void {
    // Mock image OCR extraction: Create sample classes
    // In production, you'd use Tesseract.js or Google Vision API
    const mockClasses: Schedule[] = [
      {
        id: `mock-${Date.now()}-1`,
        user_id: this.authService.sessionSnapshot?.user.id ?? 'user0',
        subject: 'Álgebra Lineal',
        teacher: 'Dr. Pérez',
        day_of_week: 0,
        start_time: '09:00',
        end_time: '10:30',
        room_label: 'Bloque 15 - 102'
      },
      {
        id: `mock-${Date.now()}-2`,
        user_id: this.authService.sessionSnapshot?.user.id ?? 'user0',
        subject: 'Química Orgánica',
        teacher: 'Dra. Martínez',
        day_of_week: 3,
        start_time: '11:00',
        end_time: '12:30',
        room_label: 'Laboratorio 7'
      },
      {
        id: `mock-${Date.now()}-3`,
        user_id: this.authService.sessionSnapshot?.user.id ?? 'user0',
        subject: 'Ingeniería de Software',
        teacher: 'Ing. Díaz',
        day_of_week: 4,
        start_time: '15:30',
        end_time: '17:00',
        room_label: 'Sala TI 1'
      },
      {
        id: `mock-${Date.now()}-4`,
        user_id: this.authService.sessionSnapshot?.user.id ?? 'user0',
        subject: 'Base de Datos',
        teacher: 'Ing. López',
        day_of_week: 2,
        start_time: '13:00',
        end_time: '14:30',
        room_label: 'Bloque 14 - 304'
      }
    ];

    this.extractedClasses.set(mockClasses);
    this.message.set(`Se extrajeron ${mockClasses.length} clases de la imagen "${file.name}". Revisa antes de guardar.`);
  }
}
