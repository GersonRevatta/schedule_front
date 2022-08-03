<template>
    <div class="mx-4 p-4">
      <div class="grid">
        <div class="col-6">
          <h3>Semana</h3>
          <TreeSelect v-model="selectedNode.selected" :options="nodes" placeholder="Seleccionar Semana"></TreeSelect>
        </div>
        <div class="col-6">
          <h3>Cliente</h3>
          <TreeSelect v-model="selectedClient.selected" :options="clients" placeholder="Seleccionar Cliente"></TreeSelect>
        </div>
      </div>
      <div v-if="searchContract">
        <div v-if="contract">
          <div>
            <Calendar :startDate="this.selectedNode.data.startDate"  :endDate="this.selectedNode.data.endDate" :hours="contract.hours" :contractId="contract.id" />
          </div>
        </div>
        <div v-else>
          <b>No existe un contrato, eliga otra semana</b>
        </div>
      </div>
      <div v-else>
        <b>
          Busque el contrato asignado a la semana y a la empresa
        </b>
      </div>
      <br>
    </div>
</template>
<script>
import Calendar from '@/views/private/views/Calendar.vue';
import TreeSelect from 'primevue/treeselect';
import { useSelectService } from "@/services/SelectService.js";
import qs from 'qs';
import moment from 'moment'
import { mapGetters } from 'vuex';

export default {
  name: 'Content',
  components: {
    TreeSelect, Calendar
  },
  data() {
    return {
      session: true,
      selectedClient: {
        data: {},
        selected: {},
        valid: false
      },
      selectedNode: { 
        data: {
          startDate: '',
          endDate: ''
        },
        selected: {},
        valid: false
      },
      nodes: [],
      clients: [],
      hours: [],
      contract: null
    };
  },
  created() {
    this.getWeek()
    this.getClients()
    this.nodes =  useSelectService();
  },
 computed: {
    ...mapGetters({
      currentUser: 'session/currentUser'
    }),
    searchContract() {
      return this.selectedClient.valid && this.selectedNode.valid
    },
  },
  watch: {
    'searchContract'() {
      this.setContract()
    },
    'selectedNode.selected'() {
      let indexNode = this.nodes.findIndex(e => e.key === `${Object.keys(this.selectedNode.selected)[0]}`)
      if (indexNode === -1) return
      this.selectedNode.data = this.nodes[indexNode]
      this.selectedNode.valid = true
      if (this.searchContract) {
        this.setContract()
      }
    },
    'selectedClient.selected'() {
      let indexClient = this.clients.findIndex(e => e.key === `${Object.keys(this.selectedClient.selected)[0]}`)
      if (indexClient === -1) return
      this.selectedClient.data = this.clients[indexClient]
      this.selectedClient.valid = true
      if (this.searchContract) {
        this.setContract()
      }
    }
  },
  methods: {
    async getWeek() {
      const response = await this.axios.get('days')
      this.$store.dispatch('day/setWeek', response.data);
    },
    setContract() {
      this.contract = this.getContract()
    },
    async getContract() {
      const params = {}
      params.filter = {
        client: this.selectedClient.data.id,
        start_date: moment(this.selectedNode.data.startDate).format('DD-MM-YYYY'),
        end_date: moment(this.selectedNode.data.endDate).format('DD-MM-YYYY')
      }
      const response = await this.axios.get(`contracts?${qs.stringify(params)}`);
      this.contract = response.data
    },
    async getClients() {
      const response = await this.axios.get('clients')
      this.clients = response.data.map((p,i) => ({
        ...p,
        key: `${i}`,
        label: `${p.name}`,
      }))
    }
  }
};
</script>
