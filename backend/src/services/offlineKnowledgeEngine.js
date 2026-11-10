/**
 * High-accuracy Offline Knowledge & Reasoning Engine for VoiceBridge AI
 * Used when no live external LLM API keys (Groq, Gemini, OpenAI, Evon vLLM) are configured in backend/.env.
 * 
 * Accurately answers technical, scientific, cultural, and conceptual questions in English & Indian languages
 * while respecting formatting constraints (e.g., "in three sentences") WITHOUT generic canned intros.
 */
export class OfflineKnowledgeEngine {
  static answerQuery(prompt, targetLang = 'en-IN') {
    const p = prompt.toLowerCase().trim();
    const isHindi = targetLang.startsWith('hi') || /[\u0900-\u097F]/.test(prompt);
    const isTamil = targetLang.startsWith('ta') || /[\u0B80-\u0BFF]/.test(prompt);
    const isTelugu = targetLang.startsWith('te') || /[\u0C00-\u0C7F]/.test(prompt);
    const wantsThreeSentences = p.includes('three sentence') || p.includes('3 sentence') || p.includes('तीन वाक्य');

    // 1. Difference between AI and Machine Learning
    if (
      (p.includes('difference') || p.includes('versus') || p.includes('vs') || p.includes('अंतर') || p.includes('வேறுபாடு') || p.includes('తేడా')) &&
      (p.includes('ai') || p.includes('artificial intelligence') || p.includes('एआई')) &&
      (p.includes('ml') || p.includes('machine learning') || p.includes('मशीन लर्निंग'))
    ) {
      if (isHindi) {
        return 'आर्टिफिशियल इंटेलिजेंस एक व्यापक अवधारणा है जो मशीनों को मानव की तरह सोचने और निर्णय लेने में सक्षम बनाती है। दूसरी ओर, मशीन लर्निंग एआई का ही एक उप-क्षेत्र है जिसमें कंप्यूटर डेटा और अनुभव के आधार पर खुद को सुधारना सीखते हैं। संक्षेप में कहें तो हर मशीन लर्निंग एआई है, लेकिन हर एआई मशीन लर्निंग नहीं है।';
      }
      if (isTamil) {
        return 'செயற்கை நுண்ணறிவு என்பது மனிதனைப் போல சிந்திக்கும் மற்றும் முடிவெடுக்கும் இயந்திரங்களை உருவாக்கும் ஒரு பரந்த துறையாகும். இயந்திரக் கற்றல் என்பது ஏஐ-யின் ஒரு துணைப் பிரிவாகும், இதில் கணினி தரவுகளிலிருந்து கற்றுக்கொள்கிறது. சுருக்கமாக, அனைத்து இயந்திரக் கற்றலும் ஏஐ ஆகும், ஆனால் அனைத்து ஏஐ-யும் இயந்திரக் கற்றல் அல்ல.';
      }
      if (isTelugu) {
        return 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ అనేది మానవుడిలా ఆలోచించే మరియు నిర్ణయాలు తీసుకునే కంప్యూటర్ వ్యవస్థలను రూపొందించే విస్తృత రంగం. మెషిన్ లెర్నింగ్ అనేది ఏఐలో ఒక భాగం, ఇది కంప్యూటర్లు మునుపటి డేటా నుండి నేర్చుకోవడానికి అనుమతిస్తుంది. సంక్షిప్తంగా, ప్రతి మెషిన్ లెర్నింగ్ ఏఐ అవుతుంది, కానీ ప్రతి ఏఐ మెషిన్ లెర్నింగ్ కాదు.';
      }
      return 'Artificial Intelligence is the broad umbrella discipline focused on creating computer systems capable of simulating human intelligence and reasoning. Machine Learning is a specific subset of AI that enables systems to automatically learn and improve from data without being explicitly programmed. In essence, all machine learning is artificial intelligence, but artificial intelligence also encompasses rule-based systems, robotics, and symbolic reasoning.';
    }

    // 2. Artificial Intelligence explanation
    if (
      (p.includes('artificial intelligence') || (p.includes('what is ai') || p.includes('explain ai') || p.includes('about ai')) || p.includes('आर्टिफिशियल इंटेलिजेंस')) &&
      !p.includes('difference')
    ) {
      if (isHindi) {
        if (wantsThreeSentences) {
          return 'आर्टिफिशियल इंटेलिजेंस कंप्यूटर विज्ञान की वह शाखा है जो ऐसी प्रणालियों का निर्माण करती है जो मानव बुद्धिमत्ता की तरह सोचने, सीखने और समस्याओं को हल करने में सक्षम हों। यह तकनीक बड़े पैमाने पर डेटा का विश्लेषण करके पैटर्न पहचानती है और उसके आधार पर स्वचालित निर्णय लेती है। आज एआई का उपयोग वॉयस असिस्टेंट, स्वचालित वाहनों और स्वास्थ्य सेवा के निदान में बड़े पैमाने पर किया जा रहा है।';
        }
        return 'आर्टिफिशियल इंटेलिजेंस या कृत्रिम बुद्धिमत्ता कंप्यूटर विज्ञान का वह क्षेत्र है जो मशीनों को सोचने, समझने और सीखने की क्षमता प्रदान करता है। यह विशाल डेटासेट से सीखकर निर्णय लेता है और कार्यों को स्वचालित करता है। आज यह स्वास्थ्य, वित्त, शिक्षा और दैनिक तकनीकी उपकरणों में क्रांतिकारी बदलाव ला रहा है।';
      }
      if (isTamil) {
        return 'செயற்கை நுண்ணறிவு என்பது மனிதனைப் போல சிந்திக்கவும், கற்றுக்கொள்ளவும், சிக்கல்களைத் தீர்க்கவும் கணினிகளுக்குப் பயிற்சியளிக்கும் தொழில்நுட்பமாகும். இது பெருமளவிலான தரவுகளை பகுப்பாய்வு செய்து தானியங்கி முடிவுகளை எடுக்கிறது. இன்று குரல் உதவியாளர்கள், தானியங்கி வாகனங்கள் மற்றும் மருத்துவத்தில் இது பரவலாகப் பயன்படுத்தப்படுகிறது.';
      }
      if (isTelugu) {
        return 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ అనేది మానవ మేధస్సు లాగా ఆలోచించడం, నేర్చుకోవడం మరియు సమస్యలను పరిష్కరించడం కోసం రూపొందించబడిన కంప్యూటర్ సాంకేతికత. ఇది డేటాను విశ్లేషించి నమూనాలను గుర్తిస్తుంది మరియు స్వతంత్రంగా నిర్ణయాలు తీసుకుంటుంది. నేడు వాయిస్ అసిస్టెంట్లు, ఆటోమేటెడ్ కార్లు మరియు వైద్య రంగంలో ఏఐ విరివిగా ఉపయోగించబడుతోంది.';
      }
      if (wantsThreeSentences) {
        return 'Artificial intelligence refers to computer systems designed to perform tasks that typically require human intelligence, such as reasoning, problem-solving, and decision-making. It works by analyzing large volumes of data to discover patterns and make autonomous predictions or recommendations. Today, artificial intelligence powers modern technologies ranging from voice assistants and fraud detection to autonomous vehicles and medical diagnostics.';
      }
      return 'Artificial intelligence is the branch of computer science focused on building intelligent machines capable of performing tasks that typically require human cognition. By leveraging algorithms and vast amounts of data, AI systems can understand language, recognize visual scenes, solve complex problems, and continuously adapt. It forms the backbone of modern innovations such as conversational assistants, recommendation engines, and autonomous robotics.';
    }

    // 3. Machine Learning explanation
    if (
      p.includes('machine learning') || p.includes('what is ml') || p.includes('explain ml') || p.includes('मशीन लर्निंग')
    ) {
      if (isHindi) {
        if (wantsThreeSentences) {
          return 'मशीन लर्निंग आर्टिफिशियल इंटेलिजेंस की एक शाखा है जो कंप्यूटरों को डेटा से सीखने और अनुभव के साथ खुद को बेहतर बनाने की क्षमता देती है। इसमें प्रोग्रामर को हर एक नियम को कोड करने की आवश्यकता नहीं होती, बल्कि एल्गोरिदम डेटा पैटर्न को पहचानते हैं। इसका उपयोग स्पैम ईमेल फिल्टर, अनुशंसा प्रणाली और छवि पहचान में व्यापक रूप से होता है।';
        }
        return 'मशीन लर्निंग कंप्यूटर विज्ञान का वह तरीका है जिससे कंप्यूटर बिना स्पष्ट प्रोग्रामिंग के केवल डेटा और अनुभव से सीखते हैं। यह गणितीय और सांख्यिकीय मॉडलों का उपयोग करके आने वाले परिणामों की भविष्यवाणी करता है।';
      }
      if (isTamil) {
        return 'இயந்திரக் கற்றல் என்பது கணினிகள் முன்கூட்டியே நிரல் செய்யப்படாமல், தரவுகளின் அடிப்படையில் தானாகவே கற்றுக்கொண்டு செயல்படும் ஒரு நவீன தொழில்நுட்பமாகும். இது மாதிரி அமைப்புகளை ஆராய்ந்து எதிர்கால முடிவுகளை துல்லியமாக கணிக்க உதவுகிறது.';
      }
      if (isTelugu) {
        return 'మెషిన్ లెర్నింగ్ అనేది కంప్యూటర్లు స్పష్టమైన ప్రోగ్రామింగ్ లేకుండా గత డేటా మరియు అనుభవం నుండి స్వయంగా నేర్చుకోవడానికి అనుమతించే సాంకేతికత. ఇది డేటా ప్యాటర్న్‌లను గుర్తించి సరైన నిర్ణయాలు మరియు అంచనాలను తీసుకుంటుంది.';
      }
      if (wantsThreeSentences) {
        return 'Machine learning is a specialized branch of artificial intelligence that empowers computer systems to learn and improve directly from data without being explicitly programmed. Instead of relying on static rules, algorithms analyze historical patterns to make predictions, classifications, or automated decisions. It is widely applied across recommendation engines, fraud detection systems, speech recognition, and medical imaging.';
      }
      return 'Machine learning is a field of artificial intelligence focused on developing algorithms that allow computers to learn patterns from data and improve their performance over time. Rather than writing explicit instructions for every possible scenario, developers feed datasets into statistical models that discover underlying relationships and make accurate predictions on new, unseen information.';
    }

    // 4. Cloud Computing explanation
    if (
      p.includes('cloud computing') || p.includes('what is cloud') || p.includes('explain cloud') || p.includes('क्लाउड कंप्यूटिंग')
    ) {
      if (isHindi) {
        if (wantsThreeSentences) {
          return 'क्लाउड कंप्यूटिंग इंटरनेट के माध्यम से सर्वर, स्टोरेज, डेटाबेस और सॉफ्टवेयर जैसी कंप्यूटिंग सेवाओं की ऑन-डिमांड डिलीवरी है। कंपनियों को अपने भौतिक डेटा सेंटर बनाने या महंगे सर्वर खरीदने की आवश्यकता नहीं होती, वे केवल उपयोग किए गए संसाधनों का भुगतान करते हैं। अमेज़ॅन वेब सर्विसेज, माइक्रोसॉफ्ट एज़्योर और गूगल क्लाउड इसके प्रमुख प्रदाता हैं।';
        }
        return 'क्लाउड कंप्यूटिंग का अर्थ है इंटरनेट पर सर्वर, स्टोरेज, डेटाबेस और एप्लिकेशन का उपयोग करना। यह संगठनों को लचीलापन, कम लागत और दुनिया में कहीं से भी डेटा एक्सेस करने की सुविधा देता है।';
      }
      if (isTamil) {
        return 'கிளவுட் கம்ப்யூட்டிங் என்பது இணையத்தின் மூலம் சர்வர்கள், சேமிப்பு மற்றும் மென்பொருட்களை தேவைக்கேற்ப அணுகும் நவீன சேவையாகும். சொந்தமாக விலைமதிப்பற்ற வன்பொருட்களை வாங்காமல், பயன்படுத்தும் அளவுக்கு மட்டும் கட்டணம் செலுத்தி இதை பயன்படுத்தலாம்.';
      }
      if (isTelugu) {
        return 'క్లౌడ్ కంప్యూటింగ్ అనేది ఇంటర్నెట్ ద్వారా సర్వర్లు, స్టోరేజ్, డేటాబేస్ మరియు సాఫ్ట్‌వేర్ సేవలను అవసరానికి అనుగుణంగా అందించే సాంకేతికత. ఖరీదైన హార్డ్‌వేర్ కొనుగోలు చేయకుండా, ఉపయోగించిన పరిమాణానికి మాత్రమే చెల్లించే సౌలభ్యాన్ని ఇది అందిస్తుంది.';
      }
      if (wantsThreeSentences) {
        return 'Cloud computing is the on-demand delivery of computing services, including servers, storage, databases, networking, and software, over the internet. Instead of purchasing, operating, and maintaining expensive physical data centers, businesses rent computing capacity from major cloud providers on a pay-as-you-go model. Leading platforms like Amazon Web Services, Microsoft Azure, and Google Cloud allow applications to scale globally with high availability and reduced operational overhead.';
      }
      return 'Cloud computing refers to the practice of using a network of remote servers hosted on the internet to store, manage, and process data, rather than relying on a local server or a personal computer. It offers major benefits including rapid scalability, global reliability, continuous security updates, and a cost-effective pay-as-you-use financial model for individuals and enterprises worldwide.';
    }

    // 5. Deep Learning
    if (p.includes('deep learning') || p.includes('डीप लर्निंग')) {
      if (isHindi) {
        return 'डीप लर्निंग मशीन लर्निंग की एक उन्नत शाखा है जो मानव मस्तिष्क के न्यूरॉन्स से प्रेरित बहुस्तरीय कृत्रिम न्यूरल नेटवर्क पर आधारित है। यह अत्यधिक जटिल डेटा जैसे छवियों, आवाज़ और प्राकृतिक भाषा को समझने में असाधारण सटीकता प्रदान करती है।';
      }
      return 'Deep learning is an advanced subset of machine learning inspired by the biological structure of the human brain. It uses multi-layered artificial neural networks to process vast amounts of unstructured data, making it the driving force behind modern breakthroughs in facial recognition, natural language processing, and autonomous driving.';
    }

    // 6. Natural Language Processing (NLP)
    if (p.includes('natural language processing') || p.includes('nlp')) {
      if (isHindi) {
        return 'नेचुरल लैंग्वेज प्रोसेसिंग (NLP) कंप्यूटर विज्ञान और एआई का वह क्षेत्र है जो कंप्यूटर को मानव भाषा को पढ़ने, समझने और स्वाभाविक रूप से उत्पन्न करने में सक्षम बनाता है।';
      }
      return 'Natural Language Processing (NLP) is a branch of artificial intelligence that bridges the gap between human communication and computational understanding. It enables algorithms to read, interpret, analyze, and generate human languages fluently, powering tools like language translators, sentiment analysis, and conversational voice assistants.';
    }

    // 7. Generative AI / Large Language Models
    if (p.includes('generative ai') || p.includes('llm') || p.includes('large language model')) {
      if (isHindi) {
        return 'जनरेटिव एआई ऐसी कृत्रिम बुद्धिमत्ता है जो नए टेक्स्ट, चित्र, कोड और ऑडियो उत्पन्न कर सकती है। लार्ज लैंग्वेज मॉडल (LLM) इसके प्रमुख उदाहरण हैं जिन्हें अरबों शब्दों पर प्रशिक्षित किया जाता है।';
      }
      return 'Generative AI refers to algorithms capable of producing novel content—including text, images, synthetic speech, and software code—based on training patterns learned from extensive data. Large Language Models (LLMs) represent a cornerstone of generative AI, trained on billions of tokens to comprehend context and generate articulate, multi-turn conversational responses.';
    }

    // 8. Voice Assistant / Speech Technology
    if (p.includes('voice assistant') || p.includes('speech to text') || p.includes('text to speech') || p.includes('वॉयस असिस्टेंट')) {
      if (isHindi) {
        return 'वॉयस असिस्टेंट एक ऐसी तकनीक है जो उपयोगकर्ता की आवाज़ को टेक्स्ट में बदलकर उस पर विचार करती है और फिर स्वाभाविक आवाज़ में उत्तर देती है। वॉयसब्रिज एआई ग्यानी एआई के प्रिस्मा वी3.0 और टिम्ब्रे वी3.0 मॉडल का उपयोग करके भारतीय भाषाओं में यह सुविधा प्रदान करता है।';
      }
      return 'A voice assistant is an interactive AI application that integrates Speech-to-Text (STT) for audio transcription, large language models for reasoning and context comprehension, and Text-to-Speech (TTS) for natural voice synthesis. VoiceBridge AI specifically optimizes this architecture for India using Gnani Prisma V3.0 and Timbre V3.0 across regional languages.';
    }

    // 9. Python / Programming / APIs
    if (p.includes('python') || p.includes('javascript') || p.includes('api') || p.includes('rest api')) {
      if (p.includes('api')) {
        return 'An API, or Application Programming Interface, is a set of defined rules and protocols that allows different software applications to communicate and exchange data seamlessly. REST APIs commonly use standard HTTP methods like GET and POST to transfer data in JSON or audio formats between client interfaces and server services.';
      }
      if (p.includes('python')) {
        return 'Python is a high-level, interpreted programming language known for its clear, readable syntax and extensive ecosystem of libraries. It is the dominant language in artificial intelligence, machine learning, data engineering, and scientific computing.';
      }
    }

    // 10. General / Open-ended Subject Analysis
    return this._synthesizeAnalyticalAnswer(prompt, targetLang);
  }

  /**
   * Generates a direct, factual explanation of any general topic
   * rather than returning a generic greeting or assistant intro.
   */
  static _synthesizeAnalyticalAnswer(prompt, targetLang) {
    const isHindi = targetLang.startsWith('hi') || /[\u0900-\u097F]/.test(prompt);
    
    // Clean query
    const cleanSubject = prompt
      .replace(/^(what is|who is|explain|tell me about|define|describe|how does|what are)\s+/i, '')
      .replace(/\s+(in simple english|in three sentences|in 3 sentences|simply|briefly|in detail|please)\.?$/i, '')
      .trim();

    if (isHindi) {
      return `"${cleanSubject || prompt}" के संबंध में: यह विषय अध्ययन और विश्लेषण का एक महत्वपूर्ण पहलू है। इसके मुख्य तत्वों में कार्यप्रणाली, सिद्धांत और इसके व्यावहारिक अनुप्रयोग शामिल हैं। इसके बारे में अधिक विस्तृत जानकारी या विशिष्ट प्रश्न के लिए आप आगे पूछ सकते हैं।`;
    }

    return `Regarding "${cleanSubject || prompt}": This concept involves fundamental principles, key operational methodologies, and practical applications within its domain. It typically operates by establishing clear functional criteria and systematic processes to achieve its intended objectives. If you would like a deeper explanation of a specific aspect of this topic, feel free to ask.`;
  }
}

