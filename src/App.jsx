import { useState } from 'react';
import { GameProvider, useGame } from './store/gameStore';
import Layout from './components/Layout';
import LevelUpModal from './components/LevelUpModal';
import BadgeNotification from './components/BadgeNotification';
import ClassSelect from './pages/ClassSelect';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';
import SkillTree from './pages/SkillTree';
import Character from './pages/Character';
import Wealth from './pages/Wealth';

const PAGES = {
  dashboard: Dashboard,
  quests: Quests,
  skills: SkillTree,
  character: Character,
  wealth: Wealth,
};

function GameApp() {
  const { playerClass } = useGame();
  const [page, setPage] = useState('dashboard');

  // Show class selection if no class chosen
  if (!playerClass) {
    return <ClassSelect />;
  }

  const PageComponent = PAGES[page];

  return (
    <>
      <Layout activePage={page} onNavigate={setPage}>
        <PageComponent onNavigate={setPage} />
      </Layout>
      <LevelUpModal />
      <BadgeNotification />
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
