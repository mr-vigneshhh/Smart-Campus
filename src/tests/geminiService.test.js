import { describe, it, expect } from 'vitest';
import {
  sanitizePrompt,
  generateCampusFallbackResponse
} from '../services/geminiService';

describe('geminiService', () => {
  describe('sanitizePrompt', () => {
    it('strips potentially harmful HTML / script tags', () => {
      const malicious = '<script>alert("hack")</script>Where is library?';
      const sanitized = sanitizePrompt(malicious);
      expect(sanitized).toBe('scriptalert("hack")/scriptWhere is library?');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('enforces length ceiling of 500 characters', () => {
      const longText = 'a'.repeat(700);
      const sanitized = sanitizePrompt(longText);
      expect(sanitized.length).toBe(500);
    });

    it('handles non-string values gracefully', () => {
      expect(sanitizePrompt(null)).toBe('');
      expect(sanitizePrompt(undefined)).toBe('');
      expect(sanitizePrompt(12345)).toBe('');
    });
  });

  describe('generateCampusFallbackResponse', () => {
    it('provides emergency dispatch details on emergency query', () => {
      const resp = generateCampusFallbackResponse('What is the police emergency phone number?');
      expect(resp).toContain('650-723-9111');
      expect(resp).toContain('Campus Safety');
    });

    it('provides accurate library guidance on study desk query', () => {
      const resp = generateCampusFallbackResponse('Where can I find quiet study desks?');
      expect(resp).toContain('Alexandria Central Library');
      expect(resp).toContain('Silent Focus');
    });

    it('provides shuttle detour guidance on transit query', () => {
      const resp = generateCampusFallbackResponse('What shuttle can I take to the athletics gym?');
      expect(resp).toContain('Marguerite Lines');
      expect(resp).toContain('Blue Line');
    });

    it('provides Wi-Fi and IT help desk hours on tech query', () => {
      const resp = generateCampusFallbackResponse('How do I setup eduroam wifi?');
      expect(resp).toContain('eduroam');
      expect(resp).toContain('IT Help Desk');
    });
  });
});
