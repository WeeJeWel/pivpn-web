new Vue({
  el: '#app',
  data: {
    authenticated: false,
    error: null,
    clients: null,
    clientDelete: null,
    clientCreate: null,
    clientCreateName: '',
    qrcode: null,
  },
  methods: {
    dateTime: value => {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(value);
    },
    refresh() {
      this.wg.getClientsStatus()
        .then(clients => {
          this.clients = clients.map(client => {
            if( client.name.includes('@') && client.name.includes('.') ) {
              client.avatar = `https://www.gravatar.com/avatar/${md5(client.name)}?d=blank`
            }

            return client;
          });
        })
        .catch(err => this.error = err);
    },
    createClient() {
      const name = this.clientCreateName;
      if( !name ) return;
      this.wg.createClient({ name })
        .catch(err => alert(err.message || err.toString()))
        .finally(() => this.refresh())
    },
    deleteClient({ name }) {
      this.wg.deleteClient({ name })
        .catch(err => alert(err.message || err.toString()))
        .finally(() => this.refresh())
    },
  },
  filters: {
    timeago: value => {
      return timeago().format(value);
    },
    bytes: (bytes, decimals, kib, maxunit) => {
      kib = kib || false
      if (bytes === 0) return '0 Bytes'
      if (isNaN(parseFloat(bytes)) && !isFinite(bytes)) return 'Not an number'
      const k = kib ? 1024 : 1000
      const dm = decimals != null && !isNaN(decimals) && decimals >= 0 ? decimals : 2
      const sizes = kib ? ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB', 'BiB'] : ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB']
      var i = Math.floor(Math.log(bytes) / Math.log(k))
      if (maxunit != undefined) {
        const index = sizes.indexOf(maxunit)
        if (index != -1) i = index
      }
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
  },
  mounted() {
    this.wg = new PiVPNWireGuard();
    this.refresh();
    setInterval(() => this.refresh(), 1000);
  },
});