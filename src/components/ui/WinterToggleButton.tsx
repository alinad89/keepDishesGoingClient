import { IconButton, Tooltip } from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { useWinterMode } from '../../contexts/WinterModeContext';

export default function WinterToggleButton() {
  const { isWinterMode, toggleWinterMode } = useWinterMode();

  const handleClick = () => {
    console.log('[WinterToggleButton] Clicked, current mode:', isWinterMode);
    toggleWinterMode();
    console.log('[WinterToggleButton] After toggle');
  };

  return (
    <Tooltip title={isWinterMode ? 'Disable Winter Mode' : 'Enable Winter Mode'}>
      <IconButton
        onClick={handleClick}
        sx={{
          color: isWinterMode ? '#4fc3f7' : 'rgba(255, 255, 255, 0.5)',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#4fc3f7',
            transform: 'rotate(180deg)',
          },
        }}
      >
        <AcUnitIcon />
      </IconButton>
    </Tooltip>
  );
}
