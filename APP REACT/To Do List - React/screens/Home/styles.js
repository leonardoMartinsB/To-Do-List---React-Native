import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Container principal
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  gradientContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Layout geral
  homeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 48,
  },

  // Seção de boas-vindas
  welcomeSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  userAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  userAvatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#495057',
    textTransform: 'uppercase',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#212529',
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 40,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Ações/buttons
  homeActions: {
    width: '100%',
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#212529',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonPressed: {
    backgroundColor: '#343a40',
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: '#212529',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: 'transparent',
  },
  outlineButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  outlineButtonText: {
    color: '#212529',
    fontSize: 16,
    fontWeight: '600',
  },

  // Ícones
  buttonIcon: {
    marginRight: 8,
  },
});