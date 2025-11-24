import { TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface SearchInputProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onValueChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'primary.main' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          fontSize: '1.1rem',
        },
      }}
    />
  )
}
