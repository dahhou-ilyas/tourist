export const getRiskColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#007AFF';
    }
};