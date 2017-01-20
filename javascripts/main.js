"use strict";
/* TVPlayer - video list */
var HTMLDivElement;
HTMLDivElement.prototype.TVPlayer = function () {
    return {
        /* element rodzica */
        parent: this,
        
        /* obsługa kontrolek */
        video: null,
        progress_bar: null,
        counter_bar: null,
        play_button: null,
        play_button_large: null,
        stop_button: null,
        play_title: null,
        
        /* obsługa stanów */
        currentIndex: 0,
        progressInterval: null,
        
        /* początkowe parametry */
        props: {
            auto: false,
            controls: true,
            stopAfterList: true,
            stopAfterVideo: false,
            delay: 0,
            list: []
        },
        /* BUDOWANIE ODTWARZACZA WIDEO - ZMIANY W STRUKTURZE */
        
        /* Inicjalizacja 
         * - przetwarzanie parametrów wejściowych
         * - ewentualna obsługa zdażeń na kontrolkach
         * - stany wejściowe elementów
         */
        init: function () {
            /* ewentualne nadpisanie parametrów domyślnych */
            Object.assign(this.props, this.props, arguments[0]);
            
            /* stworzenie elementu video i przypisanie id oraz 
             * dodanie atrybutu controls dodającego domyślne 
             * kontrolki (ukryte z użyciem css)*/
            var v = document.createElement('video');
            v.id = 'TVPlayer_inner';
            v.setAttribute('controls', '');
            
            /* sprawdzenie czy lista nie jest pusta */
            if (!this.props.list.length)
                return;
            
            /* ustawienie pierwszego domyślnego elementu z 
             * listy, zapisanie obecnego indeksu */
            v.src = this.props.list[0].src;
            this.currentIndex = 0;
            
            /* dołączenie elementu video do struktury */
            this.parent.appendChild(v);
            this.video = v;
            
            /* przekazanie elementu do zmiennej, aby był
             * widoczny w funkcjach anonimowych */
            var ref = this;
            
            /* obsługa zdażeń po włączeniu kontrolek */
            if (this.props.controls) {
                this.addControls();
                this.play_button.addEventListener('click', function () {
                    ref.play();
                }, false);
                this.play_button_large.addEventListener('click', function () {
                    ref.play();
                }, false);
                this.stop_button.addEventListener('click', function () {
                    ref.stop();
                }, false);
            }
            
            /* Obsługa zdażenia zakończenia odtwarzania wideo */
            this.video.addEventListener('ended', function () {
                ref.ended();
            }, false);

            /* Odtwarzanie lub Puza w odtwarzaniu wideo 
             * po inicjalizacji w  zależności od 
             * wartości parametru */
            if (this.props.auto)
                this.play();

            /* początkowe właściwości/wartości elementów */
            this.play_button_large.style.display = 'block';
            this.play_title.innerHTML = 'wideo: ' + this.props.list[this.currentIndex].src + ' - stopped';
            this.counter_bar.innerHTML = this.formatTime(0) + "/" + this.formatTime(0);

            return this;
        },
        /* Zamknięcie odtwarzacza */
        destruct: function () {
            console.log('destruct');
            /* W budowie */
            return this;
        },
        /* Tworzenie panelu i wszystkich elementów kontrolek */
        addControls: function () {
            /* Przycisk odtwarzania z dwoma potomami 
             * manipulowanymi z użyciem css w zależności
             * od aktualnego stanu odtwarzacza */
            var play_button = document.createElement('div');
            play_button.id = 'play';
            play_button.appendChild(document.createElement('span'));
            play_button.appendChild(document.createElement('span'));
            
            /* Przycisk odtwarzania zaślepka/poster  
             * pojawia się i znika w zależlości
             * od aktualnego stanu odtwarzacza */
            var play_button_large = document.createElement('div');
            play_button_large.id = 'play_large';
            
            /* Informuje o aktualnie odtwarzanym
             * filmie oraz o stanie odtwarzacza
             * playing/paused/stopped */
            var play_title = document.createElement('div');
            play_title.id = 'play_title';
            
            /* Zatrzymuje odtwarzanie listy,
             * przechodzi do pierwszego elementu z
             * listy w stanie stopped */
            var stop_button = document.createElement('div');
            stop_button.id = 'stop';
            stop_button.appendChild(document.createElement('span'));

            /* Pokazuje aktualny stan odtwarzania
             * (dwa nakładające się na siebie paski) */
            var progress_bar = document.createElement('div');
            progress_bar.id = 'progress_bar';
            var progress = document.createElement('div');
            progress.id = 'progress';
            progress_bar.appendChild(document.createElement('div'));
            progress_bar.appendChild(progress);

            /* Licznik aktualnego oraz docelowego 
             * czasu odtwarzania */
            var counter_bar = document.createElement('div');
            counter_bar.id = 'counter_bar';

            /* Element nadrzędny zawierający 
             * wszystkie kontrolki */
            var d = document.createElement('div');
            d.id = 'TVPlayer_controlls';

            /* Dodawanie poszczególnych kontrolek
             * do głównego panelu */
            d.appendChild(play_button);
            d.appendChild(stop_button);
            d.appendChild(progress_bar);
            d.appendChild(counter_bar);
            
            /* Dodatkowe kontrolki dodane do głównego
             * elemetu poster/stan_odtwarzacza */
            this.parent.appendChild(play_title);
            this.parent.appendChild(play_button_large);
            this.parent.appendChild(d);
            
            /* Uchwyty do manipulacji */
            this.progress_bar = progress;
            this.counter_bar = counter_bar;
            this.play_button = play_button;
            this.play_button_large = play_button_large;
            this.stop_button = stop_button;
            this.play_title = play_title;
        },
        /* Aktualizacja czasu odtwarzania */
        updateTime: function (time, duration) {
             /* Nadpisanie aktualnej zawartości elementu */
            this.counter_bar.innerHTML = this.formatTime(Math.round(time)) + "/" + this.formatTime(Math.round(duration));
            return this;
        },
        /* Aktualizacja paska odtwarzania */
        updateProgress: function (procentage) {
            /* Nadpisanie inline aktualnej właściwości  width w styly elementu */
            this.progress_bar.style.width = (procentage * 100) + "%";
            return this;
        },
        /* Formatiowanie wyświetlanego czasu */
        formatTime: function (seconds) {
            var date = new Date(seconds * 1000);
            var hh = date.getUTCHours();
            var mm = date.getUTCMinutes();
            var ss = date.getSeconds();
            if (hh < 10) {
                hh = "0" + hh;
            }
            if (mm < 10) {
                mm = "0" + mm;
            }
            if (ss < 10) {
                ss = "0" + ss;
            }
            /* Zaraca format typu 00:00:00 */
            return hh + ":" + mm + ":" + ss;
        },
        
        /* MANIPULACJA ODTWARZACZEM WIDEO */
        
        /* Przełącznik odtwarzania */
        play: function () {
            /* Jeżeli odtwarzanie jest wstrzymane lub 
             * zakończone startujemy - przeciwnym wypadku
             * wstrzymujemy odtwarzanie */
            if (!this.video.paused && !this.video.ended) {
                this.pause();
                return;
            }
            
            /* Jeśli tu jesteśmy to startujemy :D */
            this.video.play();
            
            /* Zmiana stanów kontrolek */
            this.play_title.innerHTML = 'wideo: ' + this.props.list[this.currentIndex].src + ' - playing';
            this.play_button.className = 'paused';
            this.play_button_large.style.display = '';
            
            /* Rozpoczynamy odświerzanie paska postępu
             * odtwarzania (sprawdzanie co 100ms) */
            var ref = this;
            window.clearInterval(this.progressInterval);
            this.progressInterval = self.setInterval(function () {
                ref.progress();
            }, 100);
            return this;
        },
        /* Zatrzymanie odtwarzania */
        pause: function () {
            /* Jeśli tu jesteśmy to zatrzymujemy :D */
            this.video.pause();
            
            /* Zmiana stanów kontrolek */
            this.play_title.innerHTML = 'wideo: ' + this.props.list[this.currentIndex].src + ' - paused';
            this.play_button.className = '';
            this.play_button_large.style.display = 'block';
            
            /* Zatrzymujemy odświerzanie paska postępu
             * odtwarzania (wyłączamy interwał) */
            window.clearInterval(this.progressInterval);
            return this;
        },
        /* Zatrzymanie odtwarzacz i powracamy 
         * do stanu początkowego */
        stop: function () {
            /* Jeśli tu jesteśmy to zatrzymujemy :D */
            this.video.pause();
            
            /* Zmiana stanów kontrolek */
            this.play_title.innerHTML = 'wideo: ' + this.props.list[this.currentIndex].src + ' - stopped';
            this.play_button.className = '';
            this.play_button_large.style.display = 'block';
            
            /* Zmiana aktualnego indeksu oraz filmu */
            this.currentIndex = 0;
            this.changeUrl();
            return this;
        },
        /* Następny film na liście */
        next: function () {
            /* Jeżeli aktualny film jest ostatni na
             * liście powracamy do piwrwszego elementu  */
            this.currentIndex = (this.currentIndex === this.props.list.length - 1) ? 0 : this.currentIndex + 1;
            
            /* Zatrzymujemy odtwarzanie na ostatnim
             * elemencie listy, ustawiamy pierwszy 
             * z listy  */
            if (this.currentIndex !== 0 && this.props.stopAfterList) {
                this.changeUrl();
                this.play();
            } else {
                this.currentIndex = 0;
                this.changeUrl();
            }

            return this;
        },
        /* Poprzedni film na liście */
        prev: function () {
            console.log('prev');
            /* W budowie */
            return this;
        },
        /* Przyspiesz odtwarzanie */
        folward: function () {
            console.log('folward');
            /* W budowie */
            return this;
        },
        /* Odtwarzaj wstecz */
        backward: function () {
            console.log('rewind');
            /* W budowie */
            return this;
        },
        /* Zagraj to jeszcze raz (aż się znudzi :P) */
        repeat: function () {
            console.log('repeat');
            /* W budowie */
            return this;
        },
        /* Zagraj byle co xD */
        shuffle: function () {
            console.log('shuffle');
            /* W budowie */
            return this;
        },
        /* Koniec odtwarzania */
        ended: function () {
            /* Zatrzymujemy odświerzanie paska postępu
             * odtwarzania (wyłączamy interwał) */
            window.clearInterval(this.progressInterval);
            
             /* Zmiana stanów kontrolek */
            this.play_title.innerHTML = 'wideo: ' + this.props.list[this.currentIndex].src + ' - stopped';
            this.play_button.className = '';
            this.play_button_large.style.display = 'block';
            
            /* Odtwarzanie lub Puza w odtwarzaniu wideo 
             * po zakończeniu kolenego filmu w
             * zależności od wartości parametru */
            if (!this.props.stopAfterVideo)
                this.next();
            return this;
        },
        /* Wywoływane podrzas odtwarzania */
        progress: function () {
            /* Podaje aktualny stan odtwarzania
             * currentTime - aktualny czas,
             * duration - długość filmu */
            if (this.video.readyState) {
                /* Zmiana stanu paska odtwarzacza */
                this.updateProgress(this.video.currentTime / this.video.duration);
                /* Zmiana stanu licznika odtwarzacza */
                this.updateTime(this.video.currentTime, this.video.duration);
            }
            return this;
        },
        /* Zmiana źródła odtwarzanego filmu */
        changeUrl: function () {
            this.video.src = this.props.list[this.currentIndex].src;
            /* Zmiana stanu info kontrolki */
            this.play_title.innerHTML = 'wideo: ' + this.props.list[this.currentIndex].src + ' - stopped';
            return this;
        }
    };
};