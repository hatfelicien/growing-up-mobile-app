# Adding More Kinyarwanda Translations

## Current Translations

### Home Screen
| English | Kinyarwanda |
|---------|-------------|
| Hello, Friend! 👋 | Muraho, Nshuti! 👋 |
| Welcome to your safe space to learn and grow. | Murakaza neza ahantu heza ho kwiga no gukura. |
| Your Journey | Urugendo Rwawe |
| Lessons | Amasomo |
| Quiz | Ikibazo |
| Admin Login | Kwinjira nka Umuyobozi |

### Module Screen
| English | Kinyarwanda |
|---------|-------------|
| Lessons | Amasomo |
| Loading... | Biratunganywa... |

### Lesson Screen
| English | Kinyarwanda |
|---------|-------------|
| Lesson | Isomo |
| Loading... | Biratunganywa... |
| Tap to watch video | Kanda urebe videyo |
| Share Your Thoughts | Sangiza Ibitekerezo Byawe |
| What did you think about this lesson? Any suggestions? | Watekereje iki kuri iri somo? Hari icyo usaba? |
| Submit Feedback | Ohereza Ibitekerezo |
| Thank you for your feedback! | Murakoze kubitekerezo byanyu! |

### Settings
| English | Kinyarwanda |
|---------|-------------|
| Language | Ururimi |
| English | Icyongereza |
| Kinyarwanda | Ikinyarwanda |

## How to Add More Translations

Edit `src/services/i18n.js` and add to both language objects:

```javascript
const translations = {
  en: {
    // ... existing translations
    newScreen: {
      title: 'My New Title',
      button: 'Click Me',
    }
  },
  rw: {
    // ... existing translations
    newScreen: {
      title: 'Umutwe Wanjye Mushya',
      button: 'Kanda Hano',
    }
  }
};
```

Then use in your component:
```javascript
import { useTranslation } from '../services/i18n';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('newScreen.title')}</Text>
      <Button title={t('newScreen.button')} />
    </View>
  );
}
```

## Common Kinyarwanda Phrases for the App

| English | Kinyarwanda |
|---------|-------------|
| Welcome | Murakaza neza |
| Thank you | Murakoze |
| Continue | Komeza |
| Back | Subira inyuma |
| Next | Ibikurikira |
| Previous | Ibya mbere |
| Complete | Byuzuye |
| Start | Tangira |
| Finish | Soza |
| Save | Bika |
| Cancel | Hagarika |
| Yes | Yego |
| No | Oya |
| Help | Ubufasha |
| Settings | Igenamiterere |
| Profile | Umwirondoro |
| Progress | Iterambere |
| Module | Igice |
| Video | Videyo |
| Read more | Soma byinshi |
| Share | Sangiza |
| Comment | Igitekerezo |
| Suggestion | Icyifuzo |

## Need More Translations?

If you need help translating specific content to Kinyarwanda, consider:
1. Working with native Kinyarwanda speakers
2. Using professional translation services
3. Testing with your target audience to ensure cultural appropriateness
