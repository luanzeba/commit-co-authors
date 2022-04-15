import { useState } from 'react';

import CommittingMode from './committing_mode'
import EditingMode from './editing_mode'


export default function Command() {
  const [mode, setMode] = useState<'editing' | 'committing'>('committing');

  switch (mode) {
    case 'editing':
      return <EditingMode switchMode={() => setMode('committing')} />;
    case 'committing':
      return <CommittingMode switchMode={() => setMode('editing')}/>;
  }
}
