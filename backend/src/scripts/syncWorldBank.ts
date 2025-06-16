import { connectDatabase, disconnectDatabase } from '../config/database';

async function syncWorldBankData() {
  try {
    await connectDatabase();
    
    console.log('World Bank sync not implemented yet');
    
  } catch (error) {
    console.error('Error syncing World Bank data:', error);
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  syncWorldBankData();
}