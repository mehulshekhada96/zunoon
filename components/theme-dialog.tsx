'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import './theme-dialog.css';

export interface ConfirmOptions {
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
  requirePrompt?: string;
  promptLabel?: string;
}

export interface AlertOptions {
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  buttonLabel?: string;
}

interface DialogState {
  isOpen: boolean;
  isAlertOnly: boolean;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info';
  confirmLabel: string;
  cancelLabel: string;
  requirePrompt?: string;
  promptLabel?: string;
  resolve?: (value: boolean) => void;
}

export function useConfirmDialog() {
  const [state, setState] = useState<DialogState>({
    isOpen: false,
    isAlertOnly: false,
    title: '',
    message: '',
    type: 'danger',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel'
  });

  const [promptInput, setPromptInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setPromptInput('');
      setState({
        isOpen: true,
        isAlertOnly: false,
        title: options.title,
        message: options.message,
        type: options.type || 'danger',
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
        requirePrompt: options.requirePrompt,
        promptLabel: options.promptLabel,
        resolve
      });
    });
  }, []);

  const showAlert = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise<void>((resolve) => {
      setState({
        isOpen: true,
        isAlertOnly: true,
        title: options.title,
        message: options.message,
        type: options.type || 'info',
        confirmLabel: options.buttonLabel || 'OK',
        cancelLabel: '',
        resolve: () => resolve()
      });
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    if (state.resolve) {
      state.resolve(result);
    }
    setState(prev => ({ ...prev, isOpen: false }));
    setPromptInput('');
  }, [state]);

  useEffect(() => {
    if (state.isOpen && state.requirePrompt && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [state.isOpen, state.requirePrompt]);

  // Handle ESC key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isOpen) {
        handleClose(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.isOpen, handleClose]);

  const isConfirmDisabled = state.requirePrompt
    ? promptInput.trim() !== state.requirePrompt.trim()
    : false;

  const DialogComponent = useCallback(() => {
    if (!state.isOpen) return null;

    const Icon = state.type === 'danger'
      ? AlertTriangle
      : state.type === 'warning'
      ? AlertCircle
      : Info;

    return (
      <div
        className="theme-dialog-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose(false);
        }}
      >
        <div className={`theme-dialog-box type-${state.type}`}>
          <div className="theme-dialog-header">
            <div className={`theme-dialog-icon ${state.type}`}>
              <Icon size={22} />
            </div>
            <h2 id="dialog-title" className="theme-dialog-title">{state.title}</h2>
          </div>

          <p className="theme-dialog-message">{state.message}</p>

          {state.requirePrompt && (
            <div className="theme-dialog-input-wrap">
              <label htmlFor="confirm-prompt-input">
                {state.promptLabel || `Type "${state.requirePrompt}" to confirm:`}
              </label>
              <input
                id="confirm-prompt-input"
                ref={inputRef}
                className="theme-dialog-input"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                placeholder={state.requirePrompt}
                autoComplete="off"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !isConfirmDisabled) {
                    e.preventDefault();
                    handleClose(true);
                  }
                }}
              />
            </div>
          )}

          <div className="theme-dialog-actions">
            {!state.isAlertOnly && (
              <button
                type="button"
                className="theme-dialog-btn theme-dialog-btn-cancel"
                onClick={() => handleClose(false)}
              >
                {state.cancelLabel}
              </button>
            )}
            <button
              type="button"
              className={`theme-dialog-btn theme-dialog-btn-confirm ${state.type === 'danger' ? 'danger' : ''}`}
              disabled={isConfirmDisabled}
              onClick={() => handleClose(true)}
            >
              {state.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }, [state, promptInput, isConfirmDisabled, handleClose]);

  return { confirm, showAlert, DialogComponent };
}

