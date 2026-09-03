import { describe, expect, it } from 'vitest';
import { parseWorkspace } from '../../src/domain/workspace.js';
import { workspaceFixture } from '../fixtures/workspace.js';

describe('parseWorkspace', () => {
  it('usa o usuário autenticado como proprietário de todo o agregado', () => {
    const parsed = parseWorkspace(workspaceFixture, 'auth-owner');

    expect(parsed.ownerId).toBe('auth-owner');
    expect(parsed.ingredients[0]?.ownerId).toBe('auth-owner');
    expect(parsed.offers[0]?.ownerId).toBe('auth-owner');
    expect(parsed.salesChannels[0]?.ownerId).toBe('auth-owner');
  });

  it('rejeita componente ligado a um insumo inexistente', () => {
    const invalid = structuredClone(workspaceFixture);
    invalid.offers[0]!.components[0]!.ingredientId = 'missing';

    expect(() => parseWorkspace(invalid, 'auth-owner')).toThrow(/insumo inexistente/i);
  });

  it('rejeita workspace sem exatamente um canal padrão ativo', () => {
    const invalid = structuredClone(workspaceFixture);
    invalid.salesChannels[0]!.isDefault = false;

    expect(() => parseWorkspace(invalid, 'auth-owner')).toThrow(/canal padrão ativo/i);
  });
});
